import './index.css';
import PostWidget from '../../widgets/PostWidget';
import AuthForm from '../../widgets/AuthForm';
import { usePostsStore } from '../../store/posts';
import { useEffect } from 'react';
import { useUserStore } from '../../store/user';
import { Link } from 'react-router-dom';

function MainPage() {
  const { posts, getPostsRequest } = usePostsStore();
  const { name, isAuth, logout } = useUserStore();
  
  useEffect(() => {
    getPostsRequest();
  }, [getPostsRequest]);

  return (
    <div className="mainPage">
      <header className="mainHeader">
        <div className="headerContent">
          {isAuth ? (
            <div className="profileHeader">
              <span className="profileName">{name}</span>
              <img 
                className="profileAvatar" 
                src="https://via.placeholder.com/40"
              />
              <Link to="/create-post" className="primaryBtn">
                Создать пост
              </Link>
              <button className="primaryBtn" onClick={logout}>Выйти</button>
            </div>
          ) : null}
        </div>
      </header>
      
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
                  console.log(post.author_name),
                  <PostWidget
                    key={post.id}
                    timeStamp={post.timestamp}
                    title={post.title}
                    content={post.content}
                    authorName={post.author_name}
                  />
                ))}
              </div>
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

export default MainPage;