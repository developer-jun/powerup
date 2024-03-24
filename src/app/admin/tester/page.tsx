'use client';
import React, { useState } from 'react'
import ToastManager from '@/app/admin/components/toastManager'

export default function TesterPage() {
  const [toasts, setToasts] = useState([]);
  const [autoClose, setAutoClose] = useState(false);
  const [autoCloseDuration, setAutoCloseDuration] = useState(5);
  const [position, setPosition] = useState("bottom-right");
  
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const showToast = (message, type) => {
    const toast = {
      id: Date.now(),
      message,
      type,
    };
  
    setToasts((prevToasts) => [...prevToasts, toast]);
  
    if (autoClose) {
      setTimeout(() => {
        removeToast(toast.id);
      }, autoCloseDuration * 1000);
    }
  }
  return (
    <div>
      <button onClick={() => showToast("A error message", "success")}>
        Show Success Toast
      </button>


      <ToastManager data={toasts} position={position} removeToast={removeToast} />
    </div>
  )
}
