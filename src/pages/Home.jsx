import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.jsx';
import Header from '../components/header.jsx';

function Home() {
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    const getTable = async () => {
      const data = await getDocs(collection(db, 'recipes'));
      setTableList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getTable();
    // console.log(JSON.stringify(tableList))
  },);

  return (
    <div className="App">
      <Header />
      <h1>Recipes</h1>
    </div>
  );
}

export default Home;
