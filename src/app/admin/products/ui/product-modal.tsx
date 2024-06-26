import React, { useEffect, useRef, useState } from 'react';
import './product-modal.scss';
import useProductContext from '../hooks/useProductsContext';
import { ACTIONS } from '../../reducers/productListReducer';
import ProductDetails from './product-details';

const ProductModal = () => {
  const {contextState: {dialog}, dispatch} = useProductContext();
  /*const [dialogState, setDialogState] = useState(false);

  useEffect(() => {
    console.count('[ProductModal]');
    console.log(dialogState);
  });
  const openModal = () => {
    console.log('[Opening Modal]');
    // Do something in the child component
    setDialogState(true);    
  };*/ 
  const closeModal = () => {
    dispatch({
      type: ACTIONS.UPDATE_MODAL_STATE,
      payload: {
        dialog: { isOpen: false }
      }
    });    
  }; 

  return (
    <> 
      {dialog.isOpen && (
        <dialog id="modal" className="dialog" open  modal-mode="mega">
          <div className="dialog-body">
            <div className="dialog-content">
              <header className="icon-headline">                
                <h2>Product Details</h2>              
                <button onClick={closeModal} type="button" title="Close dialog" id="closeModal" className="dialog-close-btn"> 
                  <title>Close dialog icon</title>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.70711 7.29289ZM15.7782 17.1924C16.1687 17.5829 16.8019 17.5829 17.1924 17.1924C17.5829 16.8019 17.5829 16.1687 17.1924 15.7782L15.7782 17.1924ZM7.29289 15.7782C6.90237 16.1687 6.90237 16.8019 7.29289 17.1924C7.68342 17.5829 8.31658 17.5829 8.70711 17.1924L7.29289 15.7782ZM17.1924 8.70711C17.5829 8.31658 17.5829 7.68342 17.1924 7.29289C16.8019 6.90237 16.1687 6.90237 15.7782 7.29289L17.1924 8.70711ZM7.29289 8.70711L15.7782 17.1924L17.1924 15.7782L8.70711 7.29289L7.29289 8.70711ZM8.70711 17.1924L17.1924 8.70711L15.7782 7.29289L7.29289 15.7782L8.70711 17.1924Z"
                      fill="currentColor"
                    />
                  </svg>               
                </button>
              </header>
              <article>
                <ProductDetails />
              </article>
            </div>
          </div>   
        </dialog>
      )}
    </>
  );
}

export default ProductModal;