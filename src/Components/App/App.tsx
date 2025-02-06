import { useEffect, useState } from 'react';
import { Seminar } from '../../Types/Seminar';
import Card from '../Card/Card';
import './App.css';
import axios from 'axios';
import { baseURL } from '../../Constants';

function App() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axios
      .get<Seminar[]>(baseURL)
      .then((res) => {
        setSeminars(res.data);
      })
      .catch((e) => {
        console.log(e);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [refresh]);

  return (
    <main>
      <div className='main-wrapper'>
        {isError && <h2 className='main-message'>Не удалось загрузить список семинаров</h2>}

        {isLoading && <h2 className='main-message'>Загрузка...</h2>}

        {seminars.length > 0 &&
          seminars.map((item) => <Card seminar={item} refresh={() => setRefresh((prev) => !prev)} key={item.id} />)}
      </div>
    </main>
  );
}

export default App;
