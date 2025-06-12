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

    fetchAllUsers(user.uid)
      .then(allUsers => setUsers(allUsers))
      .catch(err => console.error('Error fetching users:', err));

    const unsubscribeRequests = listenToFriendRequests(user.uid, (incomingRequests) => {
      setRequests(incomingRequests);
    });

    const unsubscribeFriends = listenToFriends(user.uid, (friendsList) => {
      setFriends(friendsList);
    });

    return () => {
      unsubscribeRequests && unsubscribeRequests();
      unsubscribeFriends && unsubscribeFriends();
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
        {/* All Users */}
        <div className="FriendBlock">
          <h2>All Users</h2>
          <ul>
            {users
              .filter(u => u.uid !== user.uid)
              .map(u => {
                const isFriend = friends.includes(u.uid);
                const isPrivate = u.private === true;

                return (
                  <li key={u.uid} className="friend-list-item">
                    <div>
                      <strong>{u.displayName || u.email || 'No Name'}</strong>
                      {isPrivate && <span className="private-label"> (Private)</span>}
                    </div>

                    {isFriend ? (
                      <span className="friend-status">✔️ Friend</span>
                    ) : isPrivate ? (
                      <span className="friend-status">🔒 Private Account</span>
                    ) : (
                      <button onClick={() => handleSendRequest(u.uid)}>Add Friend</button>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Friend Requests */}
        <div className="FriendBlock">
          <h2>Friend Requests</h2>
          <ul>
            {requests.length === 0 && <li>No pending friend requests</li>}
            {requests.map(req => (
              <li key={req.from}>
                Request from: <strong>{req.from}</strong>
                <div>
                  <button onClick={() => handleRespondToRequest(req.from, true)}>Accept</button>
                  <button onClick={() => handleRespondToRequest(req.from, false)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Friends List */}
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
                      <strong>{friendUser.displayName || 'No Name'}</strong>
                      <span> – {friendUser.email}</span>
                    </>
                  ) : (
                    <span>Loading friend info...</span>
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
