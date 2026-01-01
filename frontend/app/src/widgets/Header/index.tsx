import React, { useState, useEffect } from 'react';
import './index.css';
import AuthForm from '../../widgets/AuthForm';

interface HeaderContentProps {
  isAuth: boolean;
  userName: string;
  avatarUrl?: string;
  logout: () => void;
}

const Header: React.FC<HeaderContentProps> = ({
  isAuth,
  userName,
  avatarUrl,
  logout,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLoginClick = () => setShowAuthForm(true);
  const handleCloseAuthForm = () => setShowAuthForm(false);

  return (
    <header className="mainHeader">
      <div className="headerContent">
        {isAuth ? (
          <div className="profileHeader">
            <span className="profileName">{userName}</span>
            {avatarUrl && (
              <img
                className="profileAvatar"
                src={avatarUrl}
              />
            )}
            <a href="/create-post" className="createPostBtn" aria-label="Создать пост">
              <svg className="plusIcon" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
              </svg>
            </a>

            <button className="primaryBtn" onClick={logout}>Выйти</button>
          </div>
        ) : isMobile ? (
          <div className="profileHeader">
            {!showAuthForm && (<button className="primaryBtn" onClick={handleLoginClick}>Войти</button>)}
            {showAuthForm && (
              <div className="authModal">
                <AuthForm />
                <button className="closeBtn" onClick={handleCloseAuthForm}>Закрыть</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;