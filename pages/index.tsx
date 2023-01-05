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
  const featuredPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout>
        <Head>
          <title>Pablo Bermejo's Blog</title>
        </Head>
        <Container>
          <Intro/>
          <h3 className="mb-12 text-4xl md:text-4xl font-bold tracking-tighter leading-tight">
            Featured Story
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-x-16 lg:gap-x-32 gap-y-20 mb-12 rounded-xl p-1 transition-all w-full bg-gradient-to-r from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]">
            <div className="h-full w-full bg-white p-5 rounded-xl ">
              {featuredPost.title ?
                  (<PostPreview
                    title={featuredPost.title}
                    date={featuredPost.date}
                    author={featuredPost.author}
                    slug={featuredPost.slug}
                    excerpt={featuredPost.excerpt}
                    comments_count={featuredPost.comments_count}
                    reactions_count={featuredPost.reactions_count}
                  />
                  )
                 :
                 (<div>{featuredPost.toString()}</div>)
              }
            </div>
          </div>
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = await getAllPosts()

  const props = allPosts? 
    (allPosts[0]? allPosts : ["No posts found 🫣"]) 
    : 
    (["Ooooops 🥺. Couldn't fetch posts. There was an error calling the GitHub Issues API"])

  return  {
    props: { allPosts: props},
    revalidate: 60,
  }
    
}
