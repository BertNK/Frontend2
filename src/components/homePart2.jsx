import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import '../pages/createPost.css';
import './homePart2.css';

function HomePart2() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [reactionInput, setReactionInput] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await getDocs(collection(db, 'recipes'));
      setRecipes(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setError(null);
    } catch (err) {
      setError('Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleLike = async (recipeId) => {
    if (!user) return alert("Log in to react.");
    const ref = doc(db, 'recipes', recipeId);
    await updateDoc(ref, {
      likes: arrayUnion(user.uid),
      dislikes: arrayRemove(user.uid)
    });
    fetchRecipes();
  };

  const handleDislike = async (recipeId) => {
    if (!user) return alert("Log in to react.");
    const ref = doc(db, 'recipes', recipeId);
    await updateDoc(ref, {
      dislikes: arrayUnion(user.uid),
      likes: arrayRemove(user.uid)
    });
    fetchRecipes();
  };

const handleAddReaction = async (recipeId) => {
  const text = reactionInput[recipeId]?.trim();
  if (!text) return;

  const ref = doc(db, 'recipes', recipeId);

  // Build reaction object depending on user
  const reaction = {
    text,
    name: user?.displayName || "Ghast",
    email: user?.email || ""
  };

  try {
    await updateDoc(ref, {
      reactions: arrayUnion(reaction)
    });

    // Update local state immediately without re-fetching
    setRecipes(prevRecipes =>
      prevRecipes.map(r =>
        r.id === recipeId
          ? { ...r, reactions: [...(r.reactions || []), reaction] }
          : r
      )
    );

    setReactionInput(prev => ({ ...prev, [recipeId]: '' }));
  } catch (error) {
    alert("Failed to add reaction.");
  }
};


  const soupOfTheDay = recipes.filter(r => r.name === "Soup Of The Day");
  const otherRecipes = recipes.filter(r => r.name !== "Soup Of The Day");

  const renderRecipe = (recipe) => {
    const likes = recipe.likes?.length || 0;
    const dislikes = recipe.dislikes?.length || 0;
    const reactions = recipe.reactions || [];

    return (
      <li key={recipe.id}>
        <div className="recipe-content">
          <strong>{recipe.name}</strong><br />
          <div><em>Ingredients:</em> {recipe.ingredients || '—'}</div>
          <div><em>Duration:</em> {recipe.duration || '—'}</div>
          <div><em>Instructions:</em> {recipe.instructions || '—'}</div>
          <div><em>Made by:</em> {recipe.madeBy || 'Unknown'}</div>

          <div className="reaction-section">
            <button onClick={() => handleLike(recipe.id)}>👍 {likes}</button>
            <button onClick={() => handleDislike(recipe.id)}>👎 {dislikes}</button>

            <div>
              <input
                type="text"
                placeholder="Add a reaction"
                value={reactionInput[recipe.id] || ''}
                onChange={(e) =>
                  setReactionInput(prev => ({ ...prev, [recipe.id]: e.target.value }))
                }
              />
              {/* Added class for styling */}
              <button className="react-btn" onClick={() => handleAddReaction(recipe.id)}>React</button>
            </div>

            {reactions.length > 0 && (
            <ul className="reaction-list">
              {reactions.map((r, index) => (
                <li key={index} className="reaction-item">
                  <div className="reaction-text">{r.text}</div>
                  <em className="reaction-meta">{r.name} | {r.email}</em>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="part2MainContainer">
      <div className="part2Containersmall">
        <div className="part2Block1 ContainerPost">
          <h2>Soup Of The Day</h2>
          <ul>
            {soupOfTheDay.length > 0
              ? soupOfTheDay.map(renderRecipe)
              : <p>No Soup Of The Day today.</p>
            }
          </ul>
        </div>
      </div>

      <div className="part2Containersmall">
        <div className="part2Block3 ContainerPost">
          <h2>Recipes</h2>
          <ul>
            {otherRecipes.length > 0
              ? otherRecipes.map(renderRecipe)
              : <p>No recipes found.</p>
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePart2;
