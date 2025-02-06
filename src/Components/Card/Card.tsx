import { Dispatch, SetStateAction, useState } from 'react';
import { Seminar } from '../../Types/Seminar';
import Modal from '../Modal/Modal';
import './Card.css';
import axios from 'axios';
import { baseURL } from '../../Constants';

interface Props {
  seminar: Seminar;
  setSeminars: Dispatch<SetStateAction<Seminar[]>>;
}

//функция блокировки скролла body при открытии модальных окон
function lockBodyScroll(lock: boolean) {
  lock ? document.body.classList.add('modal-open') : document.body.classList.remove('modal-open');
}

//форматирование даты из дд.мм.гггг в гггг-мм-дд и обратно для корректной работы инпута
function convertDate(date: string) {
  if (date.includes('-')) {
    return date.split('-').reverse().join('.');
  } else {
    return date.split('.').reverse().join('-');
  }
}

export default function Card({ seminar, setSeminars }: Props) {
  //состояние формы редактирования
  const [editForm, setEditForm] = useState({ ...seminar });
  //флаг открытия модалки удаления
  const [activeDelete, setActiveDelete] = useState(false);
  //флаг открытия модалки редактирования
  const [activeEdit, setActiveEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //обработчик сабмита удаления. С учётом состояния запроса и возможных ошибок
  async function onSubmitDelete() {
    setIsError(false);
    setLoading(true);

    try {
      //отправляем запрос на удаление и достаем из ответа данные удаленного семинара
      const { data } = await axios.delete<Seminar>(baseURL + seminar.id);
      //обновляем список семинаров
      setSeminars((list) => list.filter((item) => item.id !== data.id));
      //закрываем модалку
      setActiveDelete(false);
      //разблокируем скролл
      lockBodyScroll(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }

    setLoading(false);
  }

  //обработчик сабмита редактирования. С учётом состояния запроса и возможных ошибок
  async function onSubmitEdit() {
    setIsError(false);
    setLoading(true);

    try {
      //отправляем запрос на редактирование и достаем из ответа данные отредактированного семинара
      const { data } = await axios.put<Seminar>(baseURL + seminar.id, editForm);
      //обновляем список семинаров
      setSeminars((list) => list.map((item) => (item.id === data.id ? data : item)));
      //закрываем модалку
      setActiveEdit(false);
      //разблокируем скролл
      lockBodyScroll(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }

    setLoading(false);
  }

  return (
    <div className='card'>
      <div className='card-body'>
        <div className='card-img'>
          {/* ПРИШЛОСЬ ЗАМЕНИТЬ ССЫЛКИ ИЗ-ЗА БЛОКИРОВКИ PICSUM */}
          <img src={seminar.photo} alt='' />
        </div>
        <div className='card-info'>
          <h2>{seminar.title}</h2>
          <p>{`Начало: ${seminar.date} ${seminar.time}`}</p>
          <p>{seminar.description}</p>
        </div>
      </div>

      <div className='card-footer'>
        <button
          type='button'
          onClick={() => {
            // открываем модалку
            setActiveEdit(true);
            // блокируем скролл
            lockBodyScroll(true);
          }}
        >
          Редактировать
        </button>
        <button
          type='button'
          onClick={() => {
            // открываем модалку
            setActiveDelete(true);
            // блокируем скролл
            lockBodyScroll(true);
          }}
        >
          Удалить
        </button>
      </div>

      <Modal
        active={activeEdit}
        title={'Редактировать семинар'}
        onClose={() => {
          setActiveEdit(false);
          setIsError(false);
          lockBodyScroll(false);
        }}
        onSubmit={onSubmitEdit}
        isDisabled={isLoading}
      >
        {/* передаём в модальное окно форму для редактирования. Связываем с состоянием формы editForm.
         Блокируем взаимодействие с инпутами при отправке формы */}
        <div className='modal-edit'>
          <input
            type='text'
            name='title'
            placeholder={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            value={editForm.title}
            disabled={isLoading}
          />
          <input
            type='date'
            name='date'
            placeholder={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: convertDate(e.target.value) })}
            value={convertDate(editForm.date)}
            disabled={isLoading}
          />
          <input
            type='time'
            name='time'
            placeholder={editForm.time}
            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
            value={editForm.time}
            disabled={isLoading}
          />
          <textarea
            placeholder={editForm.description}
            name='description'
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            value={editForm.description}
            disabled={isLoading}
          />
        </div>

        {/* состояние загрузки внутри модалки */}
        {isLoading && <p className='modal-loading'>Загрузка...</p>}

        {/* отображение ошибки внутри модалки */}
        {isError && <p className='modal-error'>Не удалось сохранить изменения</p>}
      </Modal>

      {/* передаём в модальное окно форму подтверждения удаления. */}
      <Modal
        active={activeDelete}
        title={'Удалить семинар'}
        onClose={() => {
          setActiveDelete(false);
          setIsError(false);
          lockBodyScroll(false);
        }}
        onSubmit={onSubmitDelete}
        isDisabled={isLoading}
      >
        <p>Вы действительно хотите удалить семинар "{seminar.title}"?</p>

        {/* состояние загрузки внутри модалки */}
        {isLoading && <p className='modal-loading'>Загрузка...</p>}

        {/* отображение ошибки внутри модалки */}
        {isError && <p className='modal-error'>Не удалось удалить семинар</p>}
      </Modal>
    </div>
  );
}
