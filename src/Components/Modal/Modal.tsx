import { PropsWithChildren } from 'react';
import './Modal.css';

interface Props {
  // активна ли модалка
  active: boolean;
  title: string;
  onSubmit: () => void;
  onClose: () => void;
  //флаг блокировки кнопок
  isDisabled?: boolean;
}
//HOC для модальных окон.
export default function Modal({
  active,
  title,
  onClose,
  onSubmit,
  children,
  isDisabled = false,
}: PropsWithChildren<Props>) {
  // возвращаем null если модалка не активна
  if (!active) return null;

  return (
    <div
      className='modal'
      onClick={(e) => {
        //закрываем модалку при клике вне нее
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
          <button type='button' className='modal-btn' onClick={onSubmit} disabled={isDisabled}>
            Подтвердить
          </button>
          <button type='button' className='modal-btn' onClick={onClose} disabled={isDisabled}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}
