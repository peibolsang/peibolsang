import PostType from '../interfaces/post'
import Author from '../interfaces/author';
import { MAX_WORDS } from './constants'
import { USER_NAMES } from './constants'
import { REPO_NAME } from './constants'
import { LABEL } from './constants'


export async function getPostFromIssue(item) {

  const issueauthor: Author = {
    name: item.user.login,
    picture: item.user.avatar_url
  }

  const post: PostType = {
    slug: {
      number: item.number,
      url: item.url
    },
    title: item.title, 
    date: item.created_at,
    author: issueauthor,
    excerpt: createExcerpt(item.body),
    ogImage: {
      url: item.user.avatar_url
    },
    content: item.body,
    comments_count: item.comments,
    reactions_count: item.reactions.total_count,

    reactions:{
      plusone: item.reactions['+1'],
      minusone: item.reactions['-1'],
      laugh: item.reactions.laugh,
      hooray: item.reactions.hooray,
      confused: item.reactions.confused,
      heart: item.reactions.heart,
      rocket: item.reactions.rocket,
      eyes: item.reactions.eyes
    }

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
  return getPostFromIssue(data);
}

export async function getAllPosts() {

  // Make the API request
  const response = await fetch(`https://api.github.com/repos/${USER_NAMES[0]}/${REPO_NAME}/issues?labels=${LABEL}`);

  // Parse the response as JSON
  const data = await response.json();

  const posts = Promise.all(data
      .filter(item => USER_NAMES.includes(item.user.login))
      .map(async (item)=> await getPostFromIssue(item))
  )

  return posts
}
