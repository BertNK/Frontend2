// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home.jsx';
import CreatePost from '/src/pages/CreatePost.jsx';
import Account from "./src/pages/account.jsx";
import Friends from './src/pages/friends.jsx';
import Dashboard from './src/pages/dashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/createPost" element={<CreatePost />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/account" element={<Account />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
