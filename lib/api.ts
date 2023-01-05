import type PostType from '../interfaces/post'
import type Author from '../interfaces/author';
import type Reactions from '../interfaces/reactions'
import type CommentType from '../interfaces/comment';
import { MAX_WORDS } from './constants'
import { USER_NAMES } from './constants'
import { REPO_NAME } from './constants'
import { LABEL } from './constants'
import {USE_OPEN_AI} from './constants'
import {HOME_OG_IMAGE_URL} from './constants'
import markdownToHtml from '../lib/markdownToHtml'
import { Configuration, OpenAIApi } from 'openai';


/* 
This function is used all over the place. The strict rate limits of the GitHub API
makes it hard to develeop and test locally, so we use the personal GitHub Token from the local env.
This gives us better API rate limits, but it's not necessary on the server (by now) 
*/

export async function fetchGitHubAPI(url: string){
  const params =  
    { method:'GET',
      headers: 
        process.env.NEXT_PUBLIC_GITHUB_TOKEN ? {
        'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_GITHUB_TOKEN
        }
        :
        {}
    }
  const response = await fetch(url,params);
  return response
}


/*
 *
 POST FUNCTIONS
 * 
 */

export async function generateTldr(text){

  // OpenAI API necessafry configuration as per the docs
  const openAIConfiguration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openAIAPI = new OpenAIApi(openAIConfiguration);
  
  // Feature flag for using OpenAI API to create the blog excerpt
  // On = Call OpenAI API to summarize the blog
  // Off = Create an excerpt using just the fist MAX_WORDS of the blog post

  if (USE_OPEN_AI){
    try{
      const response = await openAIAPI.createCompletion({
        model: "text-davinci-003",
        prompt: `Summarize the following text : ${text}\n\n`,
        temperature: 0.7,
        max_tokens: 160,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 1,
      });
      return response.data.choices[0].text
      }
      catch(err){
        console.log("Error calling OpenAI API: "+err)
    }
  }

  return createExcerpt(text)
}


export async function getPostFromGitHubIssue(item) {

  const issueauthor: Author = {
    name: item.user.login,
    picture: item.user.avatar_url,
    html_url: item.user.html_url
  }

  const issuereactions: Reactions = {
    plusone: item.reactions['+1'],
    minusone: item.reactions['-1'],
    laugh: item.reactions.laugh,
    hooray: item.reactions.hooray,
    confused: item.reactions.confused,
    heart: item.reactions.heart,
    rocket: item.reactions.rocket,
    eyes: item.reactions.eyes
  }

  const excerpt = await generateTldr(item.body)

  const post: PostType = {
    slug: {
      number: item.number,
      url: item.url
    },
    title: item.title, 
    date: item.created_at,
    author: issueauthor,
    excerpt: await markdownToHtml(excerpt || ''),
    ogImage: {
      url: HOME_OG_IMAGE_URL
    },
    content: item.body,
    comments_count: item.comments,
    reactions_count: item.reactions.total_count,
    reactions: issuereactions,
    comments: []
  }
  return post;
}

function createExcerpt(text) {
  // Split the text into an array of words
  const words = text.split(' ');

  // If the text is 15 words or fewer, return it as-is
  if (words.length <= MAX_WORDS) {
    return text;
  }

  // Otherwise, create an excerpt of the first 15 words
  const excerpt = words.slice(0, MAX_WORDS).join(' ') + '...';
  return excerpt;
}

export async function getPost(number){
  try{
    // Make the API request
    const response = await fetchGitHubAPI(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues/${number}`);
    const data = await response.json();

    // We transform the GitHub Issue into a Blog post
    return getPostFromGitHubIssue(data);
  }
  catch (error){
    console.log(error)
  }
}

export async function getAllPosts() {
  try {
    // Make the API request
    const response = await fetchGitHubAPI(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues?labels=${LABEL}`);
    const data = await response.json();

    // We only return posts created by the allowed user
    // Transforming GitHub Issues into Blog posts
    const posts = Promise.all(data
      .filter(item => USER_NAMES.includes(item.user.login))
      .map(async (item)=> await getPostFromGitHubIssue(item))
    )
    return posts
  } catch(error){
    console.log(error)
  }
}

/*
 *
 COMMENT FUNCTIONS 
 * 
 */

export async function getCommentFromGitHubIssue(item) {

  const commentauthor: Author = {
    name: item.user.login,
    picture: item.user.avatar_url,
    html_url: item.user.html_url
  }

  const commentreactions: Reactions = {
    plusone: item.reactions['+1'],
    minusone: item.reactions['-1'],
    laugh: item.reactions.laugh,
    hooray: item.reactions.hooray,
    confused: item.reactions.confused,
    heart: item.reactions.heart,
    rocket: item.reactions.rocket,
    eyes: item.reactions.eyes
  }

  const comment: CommentType = {
    slug: {
      number: item.id,
      url: item.url
    },
    date: item.created_at,
    author: commentauthor,
    ogImage: {
      url: HOME_OG_IMAGE_URL
    },
    content: await markdownToHtml(item.body || ''),
    reactions_count: item.reactions.total_count,
    reactions: commentreactions,
  }
  return comment;
}

export async function getPostComments(number){
  try {
    // Make the API request
    const response = await fetchGitHubAPI(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues/${number}/comments`);
    const data = await response.json();

    // We map Issue comments into Blog comments
    const comments = Promise.all(data
      .map(async (item)=> await getCommentFromGitHubIssue(item))
    )
    return comments
  } catch(error){
    console.log(error)
  }
}

