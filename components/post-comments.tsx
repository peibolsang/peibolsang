import type Comment from '../interfaces/comment'
import Avatar from './avatar'
import DateFormatter from './date-formatter'
import Reactions from './reactions'

type Props = {
  comments: Comment[]
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

const PostComments = ({ comments }: Props) => {
  return (
    <section>
      <h3 className="mb-8 text-4xl md:text-4xl font-bold tracking-tighter leading-tight">
        Comments
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-1 md:gap-y-8 mb-6">
        {comments.map((comment) => (
          <div className="border-2 border-color-gray p-5 rounded-xl">
            <div className="text-l">
              <DateFormatter dateString={comment.date} />
            </div>
            <Avatar name={comment.author.name} picture={comment.author.picture} />
            <div>
              {comment.content}
            </div>
            <div className="flex items-center mt-4">
              <Reactions reactions={comment.reactions}/>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PostComments
