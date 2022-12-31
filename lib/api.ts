import PostType from '../interfaces/post'
import Author from '../interfaces/author';


export async function getPostFromNumber(number){
  const username = 'peibolsang';
  const repo = 'peibolsang';

  // Make the API request
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}/issues/${number}`);
  const data = await response.json();
  return getPostFromIssue(data);
}


function createExcerpt(text) {
  // Split the text into an array of words
  const words = text.split(' ');

  // If the text is 15 words or fewer, return it as-is
  if (words.length <= 20) {
    return text;
  }

  // Otherwise, create an excerpt of the first 15 words
  const excerpt = words.slice(0, 20).join(' ') + '...';
  return excerpt;
}

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
    content: item.body

  }

  return post;

}


export async function getAllPosts() {

  const username = 'peibolsang';
  const repo = 'peibolsang';
  const label = 'published';

  // Make the API request
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}/issues?labels=${label}`);

  // Parse the response as JSON
  const data = await response.json();

  const posts = Promise.all(
      data.map(async (item)=> await getPostFromIssue(item))
  )

  return posts
}
