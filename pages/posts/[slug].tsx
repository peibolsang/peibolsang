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
  preview?: boolean
}

export default function Post({ post, preview }: Props) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug.number) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-16">
              <Head>
                <title>
                  {post.title} | Pablo Bermejo
                </title>
                <meta property="og:image" content={post.ogImage.url} />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:image" content={post.ogImage.url} />
                <meta property="twitter:title" content={post.title} />
                <meta property="twitter:description" content={post.excerpt} />
                <meta property="twitter:site" content="@peibolsang" />
              </Head>
              <PostHeader
                title={post.title}
                date={post.date}
                author={post.author}
                issuenumber={post.slug.number}
                reactions={post.reactions}
              />
              <PostBody content={post.content} />
            </article>
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
  post.comments = await getPostComments(params.slug)
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
    revalidate: 60
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug.number.toString(),
        },
      }
    }),
    fallback: 'blocking',
  }
}