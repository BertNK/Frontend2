import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase.js';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Header from '../components/header.jsx';  
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setEmail(currentUser.email || '');

        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsPrivate(data.private || false);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const reauthenticate = async () => {
    if (!user || !user.email) throw new Error('No user logged in');
    if (!currentPassword) throw new Error('Please enter your current password to confirm changes');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleUpdateProfile = async () => {
    setMessage('');
    try {
      await reauthenticate();

      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          setMessage('New password should be at least 6 characters.');
          return;
        }
        await updatePassword(user, newPassword);
      }

      await setDoc(doc(db, 'users', user.uid), {
        private: isPrivate,
        displayName,
        email: user.email,
        uid: user.uid
      }, { merge: true });

      setMessage('Profile updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="dashboardContainer">
          <p>Please log in to access the dashboard.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="dashboardContainer">
        <h2>Dashboard</h2>

        <div className="field-group">
          <label>Name:</label>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Current Password (required to save changes):</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
        </div>

        <div className="field-group">
          <label>New Password (optional):</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Account Privacy:</label>
          <select value={isPrivate ? 'private' : 'public'} onChange={e => setIsPrivate(e.target.value === 'private')}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button className="save-btn" onClick={handleUpdateProfile}>Save Changes</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>

        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
}

export default Dashboard;
