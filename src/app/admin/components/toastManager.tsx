import React, { useRef, useEffect } from 'react';
import Toast from "./toast";
import "./toastManager.scss";

const ToastManager = ({ data, position, removeToast }) => {
  const listRef = useRef(null);
  
  const handleScrolling = (el) => {
    const isTopPosition = ["top-left", "top-right"].includes(position);
    if (isTopPosition) {
      el?.scrollTo(0, el.scrollHeight);
    } else {
      el?.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    handleScrolling(listRef.current);
  }, [position, data]);

  return (
    data.length > 0 && (
      <div
        className={`toast-list toast-list--${position}`}
        aria-live="assertive"
      >
        {data.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    )
  )
};

export default ToastManager;