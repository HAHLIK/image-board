import './index.css';
import MDEditor from '@uiw/react-md-editor';

type PostProps = {
  timeStamp: string;
  title: string;
  content: string;
  authorName: string;
};

function PostWidget(props: PostProps) {
  const { timeStamp, title, content, authorName } = props;

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

        <section className='contentSection'>
          <MDEditor.Markdown
            source={content}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          />
        </section>
      </div>
    </div>
  );
}

export default PostWidget;
