import React from 'react'
import { SuccessIcon, FailureIcon, WarningIcon, CloseIcon } from './icons';
import './toast.scss'

type ToastProps = {
  message: string; 
  type: string;
  onClose: () => void;
}
const Toast = ({ message, type, onClose }: ToastProps) => {
  const icons = {
    success: <SuccessIcon />,
    error: <FailureIcon />,
    warning: <WarningIcon />,
  };

  const toastIcon = icons[type] || null;
  return (
    <div className={`toast toast--${type}`} role="alert">
      <div className="toast-message">
        {toastIcon && (
          <div className="icon icon--lg icon--thumb">{toastIcon}</div>
        )}
        <p>{message}</p>
      </div>
      <button className="toast-close-btn" onClick={onClose}>
        <span className="icon">
          <CloseIcon />
        </span>
      </button>
    </div>
  )
}


// export default Memo(Toast);
export default Toast;

