import Avatar from './avatar'
import DateFormatter from './date-formatter'
import Link from 'next/link'
import type Author from '../interfaces/author'
import markdownStyles from './markdown-styles.module.css'

type Props = {
  title: string
  date: string
  excerpt: string
  author: Author
  slug: {
    number: string,
    url: string
  } 
  comments_count: string,
  reactions_count: string,
}

const PostPreview = ({
  title,
  date,
  excerpt,
  author,
  slug,
  comments_count,
  reactions_count
}: Props) => {
  return (
    <div>
      <h3 className="text-3xl mb-2 leading-snug font-bold">
        <Link
          as={`/posts/${slug.number}`}
          href="/posts/[slug]"
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <div className="text-l">
        <DateFormatter dateString={date} />
      </div>

      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      
      <Avatar name={author.name} picture={author.picture} />

      <div className="flex items-center mt-4">
          <span className="mr-5">
              <span className="text-l mr-1">{comments_count}</span>
              <span className="text-l mr-1">&#x1F4AC;</span>
          </span>
          <span className="mr-5">
              <span className="text-l mr-1">{reactions_count}</span>
              <span className="text-l mr-1">&#x1F642;</span>
          </span>
      </div>
  
    </div>
  )
}

export default PostPreview
