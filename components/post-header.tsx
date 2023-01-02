import Avatar from './avatar'
import DateFormatter from './date-formatter'
import PostTitle from './post-title'
import type Author from '../interfaces/author'
import Reactions from './reactions'

type Props = {
  title: string
  date: string
  author: Author
  issuenumber: string
  reactions: Reactions
}

const PostHeader = ({ title, date, author, issuenumber, reactions }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-6">
        <Avatar name={author.name} picture={author.picture} html_url={author.html_url} />
      </div>
      <div>
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} html_url={author.html_url} />
        </div>
        <div className="text-l mb-5">
          <DateFormatter dateString={date} />
        </div>
      </div>
      <div className="md:flex items-center sm:flex flex-row">
        <Reactions reactions={reactions} issuenumber={issuenumber} />
      </div>
    </>
  )
}

export default PostHeader
