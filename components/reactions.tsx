import Link from 'next/link'
import type Reactions from '../interfaces/reactions'
import { USER_NAMES } from '../lib/constants'
import { REPO_NAME } from '../lib/constants'

type Props = {
  reactions: Reactions,
  issuenumber: string
}

const icons = {
  plusone: '&#x1F44D;',
  minusone: '&#x1F44E;',
  laugh: '&#128512;',
  hooray: '&#x1F389;',
  confused: '&#x1F615;',
  heart: '&#x2764;',
  rocket: '&#x1F680;',
  eyes: '&#x1F440;',
  new: '&#x1F642;'
}

const Reactions = ({ reactions,issuenumber }: Props) => {
  const href=`https://github.com/${USER_NAMES[0]}/${REPO_NAME}/issues/${issuenumber}#issuecomment-new`
  return (
    <>
      {Object.entries(reactions).map(([key, value]) => {
        if (value.toString() !== "0") {
          return (
            <div className="mb-5">
              <span className="mr-3 bg-blue-100 p-1 border-2 border-blue-300 rounded-full">
                <Link href={href}>
                  <span className="text-l mr-2" dangerouslySetInnerHTML={{ __html: icons[key] }}></span>
                  <span className="text-l mr-2">{value}</span>
                </Link>
              </span>
            </div>
          );
        }
        return null;
      })}
      <div className="mb-5">
        <span className="mr-3 bg-gray-100 p-1 border-2 border-gray-300 rounded-full">
          <Link href={href}>
              <span className="text-l mr-2" dangerouslySetInnerHTML={{ __html: icons.new }}></span>
              <span className="text-l mr-2">+</span>
          </Link>
        </span>
      </div>
    </>
  )
}

export default Reactions