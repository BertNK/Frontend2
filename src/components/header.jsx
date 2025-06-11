// src/components/Header.jsx
import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';

function Header() {
  const location = useLocation();
  const isAccountPage = location.pathname === '/account';
  const isCreatePostPage = location.pathname === '/createPost';
  const isFriendsPage = location.pathname === '/friends';

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="Header">
      <Link to="/" className="leftHeader">
        <img className="logo" src="/EatCheap.png" alt="EatCheap Logo" />
      </Link>

      <div className="middleHeader">

      </div>

     {!isAccountPage && (
      <div className="rightHeader">
        {!isCreatePostPage && (
          <Link to="/createPost" className="createPost">
            Create Post
          </Link>
        )}
        
        {!isFriendsPage && (
          <Link to="/friends" className="createPost">
            Friends
          </Link>
        )}

        <Link to={user ? "/dashboard" : "/account"} className="createPost">
          {user ? "Dashboard" : "Login"}
        </Link>
      </div>
    )}
  </div>
  );
}

export default Header;
