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
              className="toggleButton"
              onClick={() => setCommentsOpen(prev => !prev)}
            >
              {commentsOpen ? 'Скрыть комментарии' : 'Комментарии'}
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
        {commentsOpen && <CommentsWidget postId={id}/>}
      </div>
    </div>
  );
}

export default PostWidget;
