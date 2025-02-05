import { PropsWithChildren } from 'react';
import './Modal.css';

interface Props {
  active: boolean;
  title: string;
  onSubmit: () => void;
  onClose: () => void;
}
export default function Modal({ active, title, onClose, onSubmit, children }: PropsWithChildren<Props>) {
  if (!active) return null;

  return (
    <div
      className='modal'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title'>{title}</h2>
        </div>
        <div className='modal-body'>{children}</div>
        <div className='modal-footer'>
          <button type='button' className='modal-btn' onClick={onSubmit}>
            Подтвердить
          </button>
          <button type='button' className='modal-btn' onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}
