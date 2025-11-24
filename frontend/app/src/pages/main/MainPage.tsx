import './MainPage.css'
import PostWidget from '../../widgets/PostWidget/PostWidget'
import AuthForm from '../../widgets/AuthForm/AuthForm'

import {usePostsStore} from '../../entities/posts'
import { useEffect } from 'react'
import { getPosts } from './getPosts';

function MainPage() {
  const setPosts = usePostsStore(state => state.setPosts);

  useEffect(() => {
    getPosts("http://localhost/api/posts?offset=0&limit=10", setPosts)
  }, [setPosts]);

  const posts = usePostsStore(state => state.posts)

  return (
    <>
      <header className='menu'></header>
      <div style={{display: 'flex', padding: '20px 0px 0px 23%'}}>
        <div className="contentBlock">
          {posts.map((post) => (
            <PostWidget
              key={post.id}
              timeStamp={post.timestamp}
              title={post.title}
              content={post.content}
            ></PostWidget>
          ))}
        </div>
        <AuthForm></AuthForm>
      </div>
    </>
  )
}

export default MainPage
