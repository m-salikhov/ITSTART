import { useEffect, useState } from 'react';
import { Seminar } from '../../Types/Seminar';
import Card from '../Card/Card';
import './App.css';
import axios from 'axios';
import { baseURL } from '../../Constants';

function App() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data } = await axios.get<Seminar[]>(baseURL);
      setSeminars(data);

      setLoading(false);
    };

    fetchData();
  }, [refresh]);

  return (
    <main>
      <div className='main-wrapper'>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          seminars.map((item) => <Card seminar={item} refresh={() => setRefresh((prev) => !prev)} key={item.id} />)
        )}
      </div>
    </main>
  );
}

export default App;
