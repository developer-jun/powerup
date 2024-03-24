import React from 'react'
import { MessagePrompt } from '@/types/common';
import './alert.scss'

export default function Alert({message,messageType}: MessagePrompt) {
  return (
    <div className={`alert alert-${messageType}`} role="alert">
      {message}
    </div>    
  )
}
