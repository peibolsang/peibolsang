import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostComments from '../../components/post-comments'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPost, getAllPosts, getPostComments } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'

type Props = {
  post: PostType
  morePosts: PostType[]
}

export default function Post({ post }: Props) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug.number) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            {post.title? 
              (<article className="mb-16">
                <Head>
                  <title>
                    {post.title} | Pablo Bermejo's Blog
                  </title>
                  <meta property="og:image" content={post.ogImage.url} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:image" content={post.ogImage.url} />
                  <meta name="twitter:title" content={post.title} />
                  <meta name="twitter:site" content="@peibolsang" />
                </Head>
                <PostHeader
                  title={post.title}
                  date={post.date}
                  author={post.author}
                  issuenumber={post.slug.number}
                  reactions={post.reactions}
                />
                <PostBody content={post.content} />
              </article>)
              :
              (<div>
                  {post.content}
              </div>)
            }
          </>
        )}
      </Container>
        <Container>
          <div className="border-t-2 border-slate-200 pt-5">
           <PostComments comments={post.comments} issuenumber={post.slug.number} />
          </div>
        </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = await getPost(params.slug)

  const commentsdata = post ? await getPostComments(params.slug) : [""]
  const comments = commentsdata ? commentsdata : ["Ooooops 🥺. Couldn't fetch comments. There was an error calling the GitHub Issues API"]
  const content = post ? await markdownToHtml(post.content || '') : "Ooooops 🥺. Couldn't fetch post. There was an error calling the GitHub Issues API"
  const slug = post ? post.slug : { number: "0"}
 
  return {
    props: {
      post: {
        ...post,
        content,
        comments,
        slug
      },
    },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts()

  const paths = posts ? posts.map((post) => {
    return {
      params: {
        slug: post.slug.number.toString(),
      },
    }
  })
  :
  [
    {
      params: {
        slug: "0",
      },
    }
  ]

  return {
    paths: paths,
    fallback: 'blocking',
  }

}