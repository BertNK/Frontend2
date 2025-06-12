import Header from '../components/header.jsx';
import { useEffect, useState } from 'react';
import {
  fetchAllUsers,
  sendFriendRequest,
  listenToFriendRequests,
  respondToRequest,
  listenToFriends
} from '../firebase/firebaseutils.js';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import './friends.css';

function Friends() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUsers([]);
      setRequests([]);
      setFriends([]);
      return;
    }

    // Fetch all users except the current user
    fetchAllUsers(user.uid)
      .then(allUsers => setUsers(allUsers))
      .catch(err => console.error('Error fetching users:', err));

    // Listen to incoming friend requests for this user
    const unsubscribeRequests = listenToFriendRequests(user.uid, (incomingRequests) => {
      setRequests(incomingRequests);
    });

    // Listen to friends list for this user
    const unsubscribeFriends = listenToFriends(user.uid, (friendsList) => {
      setFriends(friendsList);
    });

    return () => {
      if (unsubscribeRequests) unsubscribeRequests();
      if (unsubscribeFriends) unsubscribeFriends();
    };
  }, [user]);

  const handleSendRequest = (targetUid) => {
    if (!user) return;
    sendFriendRequest(user.uid, targetUid)
      .catch(err => console.error('Send friend request error:', err));
  };

  const handleRespondToRequest = (fromUid, accept) => {
    if (!user) return;
    respondToRequest(user.uid, fromUid, accept)
      .catch(err => console.error('Respond to request error:', err));
  };

  if (!user) {
    return (
      <div className="FriendContainer">
        <Header />
        <p>Please log in to see your friends.</p>
      </div>
    );
  }

  return (
    <div className="FriendOuterContainer">
      <Header />

      <div className="FriendContainer">
        <div className="FriendBlock">
          <h2>All Users</h2>
          <ul>
            {users
              .filter(u => u.uid !== user.uid)
              .map(u => (
                <li key={u.uid} className="friend-list-item">
                  <span>{u.displayName || u.email || 'No Name'}</span>
                  {friends.includes(u.uid) ? (
                    <span className="friend-status">✔️ Friend</span>
                  ) : (
                    <button onClick={() => handleSendRequest(u.uid)}>Add Friend</button>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div className="FriendBlock">
          <h2>Friend Requests</h2>
          <ul>
            {requests.length === 0 && <li>No pending friend requests</li>}
            {requests.map(req => (
              <li key={req.from}>
                Request from: {req.from}
                <button onClick={() => handleRespondToRequest(req.from, true)}>Accept</button>
                <button onClick={() => handleRespondToRequest(req.from, false)}>Reject</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="FriendBlock">
          <h2>Friends</h2>
          <ul>
            {friends.length === 0 && <li>No friends yet</li>}
            {friends.map(friendUid => {
              const friendUser = users.find(u => u.uid === friendUid);
              return (
                <li key={friendUid}>
                  {friendUser ? (
                    <>
                      <strong>{friendUser.displayName || 'No Name'}</strong> – {friendUser.email}
                    </>
                  ) : (
                    <>Loading friend info...</>
                  )}
                </li>
              );
            })}

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Friends;
