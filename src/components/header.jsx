import './header.css';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isCreatePostPage = location.pathname === '/createPost';

  return (
    <div className="Header">
      <Link to="/" className="leftHeader">
        <img className="logo" src="/EatCheap.png" alt="EatCheap Logo" />
      </Link>

      <div className="middleHeader">

      </div>

      <div className="rightHeader">
          {!isCreatePostPage && (
          <Link to="/createPost">
            <button className="createPost">Create Post</button>
          </Link>
        )}

        <img className="loginIcon" src="/loggedout.png" alt="Login Icon" />
      </div>
    </div>
  );
}

export default Header;
