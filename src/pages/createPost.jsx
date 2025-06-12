import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '../components/header.jsx';
import "./createPost.css";

function CreatePost() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newIngredients, setNewIngredients] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState({
    name: '',
    ingredients: '',
    duration: '',
    instructions: '',
    price: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  const handleAddRecipe = async () => {
    if (!newRecipeName.trim()) return;
    if (!user) return alert("You must be logged in to add a recipe.");

    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        name: newRecipeName,
        ingredients: newIngredients,
        duration: newDuration,
        instructions: newInstructions,
        price: newPrice,
        madeBy: user.displayName || user.email
      });

      setRecipes([...recipes, {
        id: docRef.id,
        name: newRecipeName,
        ingredients: newIngredients,
        duration: newDuration,
        instructions: newInstructions,
        price: newPrice,
        madeBy: user.displayName || user.email
      }]);

      setNewRecipeName('');
      setNewIngredients('');
      setNewDuration('');
      setNewInstructions('');
      setNewPrice('');
    } catch (err) {
      alert('Failed to add recipe');
    }
  };

  const handleUpdateRecipe = async (id) => {
    const { name, ingredients, duration, instructions, price } = editingRecipe;
    if (!name.trim()) return;

    try {
      const recipeDoc = doc(db, 'recipes', id);
      await updateDoc(recipeDoc, { name, ingredients, duration, instructions, price });
      setRecipes(recipes.map(r => r.id === id ? { id, name, ingredients, duration, instructions, price } : r));
      setEditingId(null);
      setEditingRecipe({ name: '', ingredients: '', duration: '', instructions: '', price: '' });
    } catch (err) {
      alert('Failed to update recipe');
    }
  };

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
      <Header />
      <div className="ContainerPost">
        <h2>Recipes</h2>

        <div>
          <input type="text" placeholder="New recipe name" value={newRecipeName} onChange={(e) => setNewRecipeName(e.target.value)} />
          <input type="text" placeholder="Ingredients" value={newIngredients} onChange={(e) => setNewIngredients(e.target.value)} />
          <input type="text" placeholder="Duration" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
          <input type="text" placeholder="Instructions" value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)} />
          <input type="text" placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <button onClick={handleAddRecipe}>Add Recipe</button>
        </div>

        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              {editingId === recipe.id ? (
                <>
                  <div className="recipe-content">
                    <input type="text" value={editingRecipe.name} onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })} />
                    <input type="text" value={editingRecipe.ingredients} onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredients: e.target.value })} />
                    <input type="text" value={editingRecipe.duration} onChange={(e) => setEditingRecipe({ ...editingRecipe, duration: e.target.value })} />
                    <input type="text" value={editingRecipe.instructions} onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })} />
                    <input type="text" value={editingRecipe.price} onChange={(e) => setEditingRecipe({ ...editingRecipe, price: e.target.value })} />
                  </div>
                  <div className="button-group">
                    <button onClick={() => handleUpdateRecipe(recipe.id)}>Save</button>
                    <button onClick={() => {
                      setEditingId(null);
                      setEditingRecipe({ name: '', ingredients: '', duration: '', instructions: '', price: '' });
                    }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="recipe-content">
                    <strong>{recipe.name}</strong><br />
                    <div><em>Ingredients:</em> {recipe.ingredients || '—'}</div>
                    <div><em>Duration:</em> {recipe.duration || '—'}</div>
                    <div><em>Instructions:</em> {recipe.instructions || '—'}</div>
                    <div><em>Price:</em> {recipe.price || '—'}</div>
                    <div><em>Made by:</em> {recipe.madeBy || 'Unknown'}</div>
                  </div>
                  <div className="button-group">
                    <button onClick={() => {
                      setEditingId(recipe.id);
                      setEditingRecipe({
                        name: recipe.name,
                        ingredients: recipe.ingredients,
                        duration: recipe.duration,
                        instructions: recipe.instructions,
                        price: recipe.price
                      });
                    }}>Edit</button>
                    <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                  </div>
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
