import { useState } from 'react';
import './index.css';
import MDEditor from '@uiw/react-md-editor';

type PostProps = {
  timeStamp: string;
  title: string;
  content: string;
  authorName: string;
  collapseThreshold?: number;
  initialRating?: number;
  voteF: (value: number) => void;
};

function truncateMarkdown(md: string, length: number): string {
  if (md.length <= length) return md;
  return md.slice(0, length);
}

function PostWidget(props: PostProps) {
  const {
    timeStamp,
    title,
    content,
    authorName,
    collapseThreshold = 1000,
    initialRating = 0,
    voteF
  } = props;

  const [collapsed, setCollapsed] = useState(true);
  const isLong = content.length > collapseThreshold;
  const contentToShow = isLong && collapsed
    ? truncateMarkdown(content, collapseThreshold)
    : content;

  const [rating, setRating] = useState(initialRating);
  const [vote, setVote] = useState<'none' | 'up' | 'down'>('none');

  const createVote = (value: 'none' | 'up' | 'down') => {
    setVote(value)
    if (value === 'none') voteF(0)
    else if (value === 'down') voteF(-1)
    else voteF(1) 
  }

  const handleUpvote = () => {
    if (vote === 'up') {
      setRating(rating - 1);
      createVote('none');
    } else {
      createVote('up')
      if (vote === 'none') setRating(rating + 1);
      else setRating(rating + 2);
    }
  };

  const handleDownvote = () => {
    if (vote === 'down') {
      setRating(rating + 1);
      createVote('none');
    } else {
      createVote('down')
      if (vote === "none") setRating(rating - 1);
      else setRating(rating - 2)
    }
  };

  return (
    <div className='postWidget'>
      <div className="mainBlock">
        <section className="headerSection">
          <span className="authorName">{authorName}</span>
          <span className="timeText">{timeStamp}</span>
        </section>

        <section className="titleSection">
          <h2 className="title">{title}</h2>
        </section>

        <section
          className={`contentSection${isLong && collapsed ? ' contentSection--collapsed' : ''}`}
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
          {isLong ? (
            <button
              className="toggleButton"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Показать полностью" : "Свернуть"}
            </button>
          ) : <div></div>}
          <div className="ratingSection ratingSection--bottom">
            <button
              className={`ratingButton ratingButton--up${vote === 'up' ? " ratingButton--voted" : ""}`}
              title="Плюсануть"
              onClick={handleUpvote}
              aria-label="Плюсануть"
            >
              <span className="ratingArrow">▲</span>
            </button>
            <span className="ratingValue">{rating}</span>
            <button
              className={`ratingButton ratingButton--down${vote === 'down' ? " ratingButton--voted" : ""}`}
              title="Заминусить"
              onClick={handleDownvote}
              aria-label="Заминусить"
            >
              <span className="ratingArrow">▼</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PostWidget;