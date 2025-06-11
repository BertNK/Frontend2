import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import Header from '../components/header.jsx';
import './Home.css';
import HomePart1 from '../components/homePart1.jsx';
import HomePart2 from '../components/homePart2.jsx';

function Home() {
  const [, setTableList] = useState([]);

  useEffect(() => {
    const getTable = async () => {
      const data = await getDocs(collection(db, 'recipes'));
      setTableList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getTable();
  }, []);

  return (
    <div className="App">
      <Header/>

      <HomePart1/>

      <HomePart2/>
    </div>
  );
}

export default Home;
