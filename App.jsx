// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home.jsx';
import CreatePost from '/src/pages/CreatePost.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/createPost" element={<CreatePost />} />
    </Routes>
  );
}

export default App;
