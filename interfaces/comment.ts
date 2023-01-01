import Author from '../interfaces/author'

type CommentType = {
  slug: {
    number: string,
    url: string
  },
  date: string
  author: Author
  ogImage: {
    url: string
  }
  content: string
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

export default CommentType