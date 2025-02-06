import { PropsWithChildren } from 'react';
import './Modal.css';

interface Props {
  active: boolean;
  title: string;
  onSubmit: () => void;
  onClose: () => void;
  isDisabled?: boolean;
}
export default function Modal({
  active,
  title,
  onClose,
  onSubmit,
  children,
  isDisabled = false,
}: PropsWithChildren<Props>) {
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
