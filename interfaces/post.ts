import Author from '../interfaces/author'

type PostType = {
  slug: {
    number: string,
    url: string
  },
  title: string
  date: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
  comments_count: string
  reactions_count: string
  reactions:{
    plusone: string
    minusone: string
    laugh: string
    hooray: string
    confused: string
    heart: string
    rocket: string
    eyes: string
  }
}

export default PostType
