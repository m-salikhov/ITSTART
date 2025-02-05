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
  const [activeDelete, setActiveDelete] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);
  const [editForm, setEditForm] = useState(seminar);

  async function onSubmitDelete() {
    await axios.delete(baseURL + seminar.id).catch((e) => {});
    refresh();
    setActiveDelete(false);
  }

  async function onSubmitEdit() {
    await axios.put(baseURL + seminar.id, editForm);
    refresh();
    setActiveEdit(false);
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
        onClose={() => setActiveEdit(false)}
        onSubmit={onSubmitEdit}
      >
        <div className='modal-edit'>
          <input
            type='text'
            name='title'
            placeholder={seminar.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            value={editForm.title}
          />
          <input
            type='date'
            name='date'
            placeholder={seminar.date}
            onChange={(e) => setEditForm({ ...editForm, date: convertDate(e.target.value) })}
            value={convertDate(editForm.date)}
          />
          <input
            type='time'
            name='time'
            placeholder={seminar.time}
            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
            value={editForm.time}
          />
          <textarea
            placeholder={seminar.description}
            name='description'
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            value={editForm.description}
          />
        </div>
      </Modal>

      <Modal
        active={activeDelete}
        title={'Удалить семинар'}
        onClose={() => setActiveDelete(false)}
        onSubmit={onSubmitDelete}
      >
        <p>Вы действительно хотите удалить семинар "{seminar.title}"?</p>
      </Modal>
    </div>
  );
}
