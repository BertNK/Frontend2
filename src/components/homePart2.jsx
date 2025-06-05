import { useEffect, useState } from 'react';
import {
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase.jsx';
import '../pages/createPost.css'; // reuse styles
import './homePart2.css';

function HomePart2() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
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

    fetchRecipes();
  }, []);

  const soupOfTheDay = recipes.filter(recipe => recipe.name === "Soup Of The Day");
  const otherRecipes = recipes.filter(recipe => recipe.name !== "Soup Of The Day");

  return (
    <div className="part2MainContainer">
      <div className="part2Containersmall">
        <div className="part2Block1">
          <h2>Soup Of The Day {loading ? '(Loading...)' : error ? `(Error: ${error})` : ''}</h2>
          <ul>
            {soupOfTheDay.length > 0 ? soupOfTheDay.map(recipe => (
              <li key={recipe.id}>
                <div className="recipe-content">
                  <strong>{recipe.name}</strong><br />
                  <div><em>Ingredients:</em> {recipe.ingredients || '—'}</div>
                  <div><em>Duration:</em> {recipe.duration || '—'}</div>
                  <div><em>Instructions:</em> {recipe.instructions || '—'}</div>
                  <div><em>Made by:</em> {recipe.madeBy || 'Unknown'}</div>
                </div>
              </li>
            )) : <p>No Soup Of The Day recipe today!</p>}
          </ul>
        </div>
        <div className="part2Block2">
          {/* Left Block 2 - empty for now */}
        </div>
      </div>

      <div className="part2Containersmall">
        <div className="part2Block3 ContainerPost">
          <h2>Recipes {loading ? '(Loading...)' : error ? `(Error: ${error})` : ''}</h2>
          <ul>
            {otherRecipes.length > 0 ? otherRecipes.map(recipe => (
              <li key={recipe.id}>
                <div className="recipe-content">  
                  <strong>{recipe.name}</strong><br />
                  <div><em>Ingredients:</em> {recipe.ingredients || '—'}</div>
                  <div><em>Duration:</em> {recipe.duration || '—'}</div>
                  <div><em>Instructions:</em> {recipe.instructions || '—'}</div>
                  <div><em>Made by:</em> {recipe.madeBy || 'Unknown'}</div>
                </div>
              </li>
            )) : <p>No other recipes found.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePart2;
