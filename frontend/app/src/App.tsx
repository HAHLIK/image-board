import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import MainPage from './pages/main';
import CreatePostPage from './pages/createPost';
import { useUserStore } from './store/user';

function App() {
  const setIsAuth = useUserStore((state) => state.setIsAuth)

  useEffect(() => {
    setIsAuth();
  }, [setIsAuth]);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
    </Routes>
  );
}

export default App;
