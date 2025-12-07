import './index.css';
import PostWidget from '../../widgets/PostWidget';
import AuthForm from '../../widgets/AuthForm';
import Header from '../../widgets/Header'
import { usePostsStore } from '../../store/posts';
import { useEffect, useRef } from 'react';
import { useUserStore } from '../../store/user';

export default function MainPage() {
  const { posts, getPostsRequest, isLoading } = usePostsStore();
  const { name, isAuth, logout } = useUserStore();
  
  const bottomRef = useRef(null);

  useEffect(() => {
    getPostsRequest();
  }, [getPostsRequest]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          getPostsRequest();
        }
      },
      { threshold: 1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    return () => observer.disconnect();
  }, [isLoading, getPostsRequest]);

  return (
    <div className="mainPage">
      <Header
        isAuth={isAuth}
        userName={name}
        avatarUrl=""
        logout={logout}
      />
      
      <main className="mainContent">
        <div className="contentWrapper">
          <div className="postsSection">
            {posts.length === 0 ? (
              <div className="emptyState">
                <h3>Пока нет постов</h3>
              </div>
            ) : (
              <div className="postsGrid">
                {posts.map((post) => (
                  <PostWidget
                    key={post.id}
                    timeStamp={post.timestamp}
                    title={post.title}
                    content={post.content}
                    authorName={post.author_name}
                  />
                ))}
                <div ref={bottomRef} style={{ height: 1 }} />
              </div>
            )}

            {isLoading && (
              <div className="loadingMore">Загрузка...</div>
            )}
          </div>
          
          <aside className="sidebar">
            {!isAuth && <AuthForm />}
          </aside>
        </div>
      </main>
    </div>
  );
}
