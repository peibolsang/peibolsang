import type PostType from '../interfaces/post'
import type Author from '../interfaces/author';
import type Reactions from '../interfaces/reactions'
import type CommentType from '../interfaces/comment';
import { MAX_WORDS } from './constants'
import { USER_NAMES } from './constants'
import { REPO_NAME } from './constants'
import { LABEL } from './constants'
import {HOME_OG_IMAGE_URL} from './constants'
import markdownToHtml from '../lib/markdownToHtml'
import { Configuration, OpenAIApi } from 'openai';

/*
 *
 POST FUNCTIONS
 * 
 */

export async function generateTldr(text){
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  /*
  try{
    const response = await openai.createCompletion({
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
  */
      return createExcerpt(text)
  // }
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
  // Make the API request
  const response = await fetch(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues/${number}`);
  const data = await response.json();
  return getPostFromGitHubIssue(data);
}

export async function getAllPosts() {

  // Make the API request
  const response = await fetch(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues?labels=${LABEL}`);

  // Parse the response as JSON
  const data = await response.json();
  const posts = Promise.all(data
      .filter(item => USER_NAMES.includes(item.user.login))
      .map(async (item)=> await getPostFromGitHubIssue(item))
  )
  return posts
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
  // Make the API request
  const response = await fetch(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues/${number}/comments`);
  
  const data = await response.json();
  const comments = Promise.all(data
    .map(async (item)=> await getCommentFromGitHubIssue(item))
  )
  return comments
}

