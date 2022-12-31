import Avatar from './avatar'
import DateFormatter from './date-formatter'
import PostTitle from './post-title'
import type Author from '../interfaces/author'

type Props = {
  title: string
  date: string
  author: Author
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

const icons = {
  plusone: '&#x1F44D;',
  minusone: '&#x1F44E;',
  laugh: '&#128512;',
  hooray: '&#x1F389;',
  confused: '&#x1F615;',
  heart: '&#x2764;',
  rocket: '&#x1F680;',
  eyes: '&#x1F440;'

}

const PostHeader = ({ title, date, author, reactions }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-6">
        <Avatar name={author.name} picture={author.picture} />
      </div>
      <div>
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="text-l">
          <DateFormatter dateString={date} />
        </div>
      </div>
      <div className="mt-5">
      {Object.entries(reactions).map(([key, value]) => {
        if (value.toString() !== "0") {
          return (
            <span className="mr-5 mt-5">
              <span className="text-l mr-1">{value}</span>
              <span className="text-l mr-1" dangerouslySetInnerHTML={{ __html: icons[key] }}></span>
            </span>
          );
        }
        return null;
      })}
    </div>
    </>
  )
}

export default PostHeader
