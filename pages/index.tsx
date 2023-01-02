import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import type Post from '../interfaces/post'
import PostPreview from '../components/post-preview'

type Props = {
  allPosts: Post[]
}

export default function Index({ allPosts }: Props) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout>
        <Head>
          <title>Pablo Bermejo</title>
        </Head>
        <Container>
          <Intro/>
          <h3 className="mb-12 text-4xl md:text-4xl font-bold tracking-tighter leading-tight">
            Featured Story
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-x-16 lg:gap-x-32 gap-y-20 mb-12 border-2 border-gray-300 rounded-xl p-5">
            {heroPost && (
              <PostPreview
                title={heroPost.title}
                date={heroPost.date}
                author={heroPost.author}
                slug={heroPost.slug}
                excerpt={heroPost.excerpt}
                comments_count={heroPost.comments_count}
                reactions_count={heroPost.reactions_count}
              />
            )}
          </div>
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = await getAllPosts()

  return {
    props: { allPosts },
    revalidate: 60,
  }
}
