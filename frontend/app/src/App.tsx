import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/main';
import CreatePostPage from './pages/createPost';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
    </Routes>
  );
}

export default App;