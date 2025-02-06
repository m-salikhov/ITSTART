import { useState } from 'react';
import { Seminar } from '../../Types/Seminar';
import Modal from '../Modal/Modal';
import './Card.css';
import axios from 'axios';
import { baseURL } from '../../Constants';

interface Props {
  seminar: Seminar;
  refresh: () => void;
}

function convertDate(date: string) {
  if (date.includes('-')) {
    return date.split('-').reverse().join('.');
  } else {
    return date.split('.').reverse().join('-');
  }
}

export default function Card({ seminar, refresh }: Props) {
  const [editForm, setEditForm] = useState(seminar);
  const [activeDelete, setActiveDelete] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function onSubmitDelete() {
    setIsError(false);
    setLoading(true);

    try {
      await axios.delete(baseURL + seminar.id);
      refresh();
      setActiveDelete(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }

    setLoading(false);
  }

  async function onSubmitEdit() {
    setIsError(false);
    setLoading(true);

    try {
      await axios.put(baseURL + seminar.id, editForm);
      refresh();
      setActiveEdit(false);
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
          <img src={seminar.photo} alt='' />
        </div>
        <div className='card-info'>
          <h2>{seminar.title}</h2>
          <p>{`Начало: ${seminar.date} ${seminar.time}`}</p>
          <p>{seminar.description}</p>
        </div>
      </div>

      <div className='card-footer'>
        <button type='button' onClick={() => setActiveEdit(true)}>
          Редактировать
        </button>
        <button type='button' onClick={() => setActiveDelete(true)}>
          Удалить
        </button>
      </div>

      <Modal
        active={activeEdit}
        title={'Редактировать семинар'}
        onClose={() => {
          setActiveEdit(false);
          setIsError(false);
        }}
        onSubmit={onSubmitEdit}
        isDisabled={isLoading}
      >
        <div className='modal-edit'>
          <input
            type='text'
            name='title'
            placeholder={seminar.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            value={editForm.title}
            disabled={isLoading}
          />
          <input
            type='date'
            name='date'
            placeholder={seminar.date}
            onChange={(e) => setEditForm({ ...editForm, date: convertDate(e.target.value) })}
            value={convertDate(editForm.date)}
            disabled={isLoading}
          />
          <input
            type='time'
            name='time'
            placeholder={seminar.time}
            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
            value={editForm.time}
            disabled={isLoading}
          />
          <textarea
            placeholder={seminar.description}
            name='description'
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            value={editForm.description}
            disabled={isLoading}
          />
        </div>

        {isLoading && <p className='modal-loading'>Загрузка...</p>}

        {isError && <p className='modal-error'>Не удалось сохранить изменения</p>}
      </Modal>

      <Modal
        active={activeDelete}
        title={'Удалить семинар'}
        onClose={() => {
          setActiveDelete(false);
          setIsError(false);
        }}
        onSubmit={onSubmitDelete}
        isDisabled={isLoading}
      >
        <p>Вы действительно хотите удалить семинар "{seminar.title}"?</p>

        {isLoading && <p className='modal-loading'>Загрузка...</p>}

        {isError && <p className='modal-error'>Не удалось удалить семинар</p>}
      </Modal>
    </div>
  );
}
