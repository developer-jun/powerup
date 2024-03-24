import React from 'react'
import '@/components/blocks/loader.scss';
export default function Loader() {
  return (
    <>
      <span className="spinner"></span>
      <span className="visually-hidden">Loading...</span>
    </>
  )
}

{/*<div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>*/}