import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../firebase.jsx';
import Header from '../components/header.jsx';
import "./createPost.css";

function CreatePost() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // read / Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getDocs(collection(db, 'recipes'));
        setRecipes(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setError(null);
      } catch (err) {
        setError('Failed to connect to database');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // create recipe
  const handleAddRecipe = async () => {
    if (!newRecipeName.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'recipes'), { name: newRecipeName });
      setRecipes([...recipes, { id: docRef.id, name: newRecipeName }]);
      setNewRecipeName('');
    } catch (err) {
      alert('Failed to add recipe');
    }
  };

  // update recipe
  const handleUpdateRecipe = async (id) => {
    if (!editingName.trim()) return;

    try {
      const recipeDoc = doc(db, 'recipes', id);
      await updateDoc(recipeDoc, { name: editingName });
      setRecipes(recipes.map(r => (r.id === id ? { ...r, name: editingName } : r)));
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      alert('Failed to update recipe');
    }
  };

  // delete recipe
  const handleDeleteRecipe = async (id) => {
    try {
      const recipeDoc = doc(db, 'recipes', id);
      await deleteDoc(recipeDoc);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

return (
  <div className="justacontainer">
    {/* header */}
    <Header />
    
    <div className="ContainerPost">

      <h2>Recipes {loading ? '(L...)' : error ? `(E: ${error})` : 'C'}</h2>
      {/* add new recipe */}
      <div>
        <input
          type="text"
          placeholder="New recipe name"
          value={newRecipeName}
          onChange={(e) => setNewRecipeName(e.target.value)}
        />
        <button onClick={handleAddRecipe}>Add Recipe</button>
      </div>

      {/* list and edit recipes */}
      <ul>
        {recipes.map(({ id, name }) => (
          <li key={id}>
            {editingId === id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleUpdateRecipe(id)}>Save</button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{name}</span>
                <button onClick={() => {
                  setEditingId(id);
                  setEditingName(name);
                }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteRecipe(id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}

export default CreatePost;
