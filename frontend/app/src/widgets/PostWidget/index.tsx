import { useState } from 'react';
import { useUserStore } from '../../store/user';
import './index.css';
import MDEditor from '@uiw/react-md-editor';
import CommentsWidget from '../CommentsWidget';

type PostProps = {
  id: number;
  timeStamp: string;
  title: string;
  content: string;
  authorName: string;
  commentsCount: number;
  collapseThreshold?: number;
  initialRating?: number;
  initialVote?: number;
  voteF: (value: number) => void;
};

function truncateMarkdown(md: string, length: number): string {
  if (md.length <= length) return md;
  return md.slice(0, length);
}

function PostWidget(props: PostProps) {
  const {
    id,
    timeStamp,
    title,
    content,
    authorName,
    commentsCount,
    collapseThreshold = 1000,
    initialRating = 0,
    initialVote = 0,
    voteF,
  } = props;

  const isAuth = useUserStore(state => state.isAuth);

  const [collapsed, setCollapsed] = useState(true);
  const [rating, setRating] = useState(initialRating);
  const [vote, setVote] = useState<'none' | 'up' | 'down'>(() => {
    if (initialVote === 1) return 'up';
    if (initialVote === -1) return 'down';
    return 'none';
  });
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const isLong = content.length > collapseThreshold;
  const contentToShow =
    isLong && collapsed
      ? truncateMarkdown(content, collapseThreshold)
      : content;

  const showAuthMessage = () => {
    setAuthMessage('Войдите или зарегистрируйтесь, чтобы голосовать');
    setTimeout(() => setAuthMessage(null), 2500);
  };

  const createVote = (value: 'none' | 'up' | 'down') => {
    setVote(value);
    if (value === 'none') voteF(0);
    else if (value === 'down') voteF(-1);
    else voteF(1);
  };

  const handleUpvote = () => {
    if (!isAuth) {
      showAuthMessage();
      return;
    }

    if (vote === 'up') {
      setRating(rating - 1);
      createVote('none');
    } else {
      createVote('up');
      if (vote === 'none') setRating(rating + 1);
      else setRating(rating + 2);
    }
  };

  const handleDownvote = () => {
    if (!isAuth) {
      showAuthMessage();
      return;
    }

    if (vote === 'down') {
      setRating(rating + 1);
      createVote('none');
    } else {
      createVote('down');
      if (vote === 'none') setRating(rating - 1);
      else setRating(rating - 2);
    }
  };

  return (
    <div className="postWidget">
      <div className="mainBlock">
        <section className="headerSection">
          <span className="authorName">{authorName}</span>
          <span className="timeText">{timeStamp}</span>
        </section>

        <section className="titleSection">
          <h2 className="title">{title}</h2>
        </section>

        <section
          className={`contentSection${
            isLong && collapsed ? ' contentSection--collapsed' : ''
          }`}
        >
          <MDEditor.Markdown
            source={contentToShow}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          />
        </section>

        <section className="bottomActions">
          <div>
            {isLong && (
            <button
              className="toggleButton"
              onClick={() => setCollapsed(!collapsed)}
            >
            {collapsed ? 'Показать полностью' : 'Свернуть'}
            </button>
            )}
            <button
              className="toggleButton commentButton"
              onClick={() => setCommentsOpen(prev => !prev)}
              aria-label={commentsOpen ? 'Скрыть комментарии' : 'Комментарии'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="rgba(255, 255, 255, 0.36)"
                stroke="none"
               >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <rect x="7" y="7.5" width="11" height="1.6" fill="var(--bg-elevated)" />
                <rect x="7" y="11.5" width="11" height="1.6" fill="var(--bg-elevated)" />
              </svg>
            <span className="commentsCount">{commentsCount}</span>
          </button>
          </div>
          <div className="ratingSection ratingSection--bottom">
            <button
              className={`ratingButton ratingButton--up${
                vote === 'up' ? ' ratingButton--voted' : ''
              }`}
              onClick={handleUpvote}
              aria-label="Плюсануть"
            >
              <span className="ratingArrow">▲</span>
            </button>

            <span className="ratingValue">{rating}</span>

            <button
              className={`ratingButton ratingButton--down${
                vote === 'down' ? ' ratingButton--voted' : ''
              }`}
              onClick={handleDownvote}
              aria-label="Заминусить"
            >
              <span className="ratingArrow">▼</span>
            </button>
          </div>
        </section>

        {authMessage && <div className="authMessage">{authMessage}</div>}
      </div>
      {commentsOpen && (
        <div className="commentsWrapper">
          <CommentsWidget postId={id} />
        </div>
      )}
    </div>
  );
}

export default PostWidget;
