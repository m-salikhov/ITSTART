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

  //загружаем список семинаров с сервера, обрабатываем ошибки и состояние загрузки
  useEffect(() => {
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
  }, []);

  return (
    <main>
      <div className='main-wrapper'>
        {isError && <h2 className='main-message'>Не удалось загрузить список семинаров</h2>}
        {isLoading && <h2 className='main-message'>Загрузка...</h2>}

        {/* отрисовываем карточки семинаров в случае успешной загрузки. 
        передаем функцию для обновления списка семинаров */}
        {seminars.length > 0 && seminars.map((item) => <Card seminar={item} setSeminars={setSeminars} key={item.id} />)}
      </div>
    </main>
  );
}

export default App;
