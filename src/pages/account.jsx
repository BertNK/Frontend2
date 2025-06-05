import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import Header from '../components/header.jsx';
import './account.css';
import { useNavigate } from 'react-router-dom';

function Account() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !name) {
        return setMessage('Please fill in all fields.');
    }

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCred.user, { displayName: name });

        setMessage('Registration successful! Redirecting..');
        setEmail('');
        setPassword('');
        setName('');
        await delay(2000); 
        navigate('/'); // Redirect here
    } catch (error) {
        setMessage('Registration failed: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setMessage('Login successful! Redirecting..');
        await delay(2000); 
        navigate('/');
    } catch (err) {
        setMessage('Login failed: ' + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        setMessage(`Logged in as ${result.user.displayName}! Redirecting..`);
        await delay(2000); 
        navigate('/');
    } catch (error) {
        setMessage('Google login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMessage('Logged out.');
  };

  return (
    <div className="account-container">
      <Header />
      <div className="auth-box">
        {user ? (
          <>
            <h2>Welcome, {user.displayName || user.email}!</h2>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="button-row">
            <button onClick={isLogin ? handleLogin : handleRegister}>
                {isLogin ? 'Login' : 'Register'}
            </button>
            <div className="google-icon" onClick={handleGoogleLogin} title="Sign in with Google">
                <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Sign-In"
                />
            </div>
            </div>
            <p onClick={() => setIsLogin(!isLogin)} className="toggle-mode">
              {isLogin ? 'No account? Register' : 'Have an account? Login'}
            </p>
          </>
        )}
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Account;
