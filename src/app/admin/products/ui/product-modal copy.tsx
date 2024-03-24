import React, { useEffect, useRef, useState } from 'react';

import ProductDetails from "./product-details";
import './product-modal.scss';

const ProductModal = React.forwardRef((props, ref) => {
  const [dialogState, setDialogState] = useState(false);

  useEffect(() => {
    console.count('[ProductModal]');
    console.log(dialogState);
  });
  const childFunction = (id: number) => {
    console.log('[Child Function] id: ', id);
    // Do something in the child component
    setDialogState(true);    
  };

  React.useImperativeHandle(ref, () => ({
    childFunction,
  }));
  
  const closeModal = () => {
    setDialogState(false);
  };  

  return (
    <> 
      {dialogState && (
        <dialog id="modal" className="modal" open  inert loading modal-mode="mega">
          <div className="two-columned-content">
            <header> 
              <section className="icon-headline">
                <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <h3>Product Details</h3>
              </section>
              <button onClick={closeModal} type="button" title="Close dialog" id="closeModal" className="dialog-close-btn"> 
                <title>Close dialog icon</title>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </header>
            <article>
              <section className="form-content">
                <h1 className="title">
                  <a className="custom-btn sm-btn" href="/admin/product"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Back</a> Add New Product
                </h1>        
                {children}
              </section>              
            </article>
          </div>        
        </dialog>
      )}
    </>
  );
});

export default ProductModal;