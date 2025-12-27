import { useEffect } from 'react';
import { usePostsStore } from '../../store/posts';
import './index.css';

type CommentsProps = {
    postId: number
}

function CommentsWidget({ postId }: CommentsProps) {
  const commentsStore = usePostsStore(state => state.comments);
  const loadComments = usePostsStore(state => state.getCommentsRequest);

  const postCommentsObj = commentsStore[postId];
  const comments = postCommentsObj?.batch ?? [];
  const hasMore = postCommentsObj?.hasMore;
  const isLoading = postCommentsObj?.isLoading;

  useEffect(() => {
    if (!postCommentsObj) {
      loadComments(postId);
    }
  }, [postId, loadComments, postCommentsObj]);

  if (!comments.length && !isLoading) {
    return (
      <section className="commentsSection">
        <div className="commentsHeader">Комментарии</div>
        <div className="commentAuthHint">Комментариев пока нет</div>
      </section>
    );
  }

  return (
    <section className="commentsSection">
      <div className="commentsHeader">Комментарии</div>

      <div className="commentsList">
        {comments.map(comment => (
          <div key={comment.id} className="commentItem">
            <div className="commentAvatar" />
            <div className="commentContent">
              <div className="commentHeader">
                <span className="commentAuthor">{comment.author_name}</span>
                <span className="commentTime">{comment.timestamp}</span>
              </div>
              <div className="commentText">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && !isLoading && (
        <button onClick={() => loadComments(postId)}>
          Загрузить ещё
        </button>
      )}

      {isLoading && <div>Загрузка...</div>}
    </section>
  );
}


export default CommentsWidget;
