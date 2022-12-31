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
}

export default PostType
