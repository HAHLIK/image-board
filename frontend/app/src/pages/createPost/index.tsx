import "./index.css";
import MarkdownEditorWidget from "../../widgets/MarkdownEditor";
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/user";
import { usePostsStore } from "../../store/posts";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const { isAuth, name, logout } = useUserStore();
  const { createPostRequest } = usePostsStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    await createPostRequest(title, content);

    navigate("/");
  };

  useEffect(() => {
      if (!isAuth) {
        navigate("/")
      }
    }, [isAuth]);

  return (
    <div className="createPostPage">
      <header className="mainHeader">
        <div className="headerContent">
          {isAuth && (
            <div className="profileHeader">
              <span className="profileName">{name}</span>
              <img
                className="profileAvatar"
                src="https://via.placeholder.com/40"
              />
              <button className="logoutBtn" onClick={logout}>
                Выйти
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="createContent">
        <div className="createWrapper card fade-in">
          <h2 className="createTitle">Создать пост</h2>

          <div className="inputGroup">
            <label>Заголовок поста</label>
            <input
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label>Содержимое</label>
            <MarkdownEditorWidget
              value={content}
              onChange={(value?: string) => setContent(value || "")}
              height="400px"
            />
          </div>

          <button
            className="primary publishBtn"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            Опубликовать пост
          </button>
        </div>
      </main>
    </div>
  );
}
