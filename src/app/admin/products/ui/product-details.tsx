"use client"

import { useEffect } from "react"
import { Product } from "@/types/product"
import { PRODUCT } from '@/app/admin/utils/constants';
import "./product-form.scss";
import "@/components/layout/form.scss";

import Loader from '@/components/blocks/loader';
import useProducts from "../../hooks/useProducts";
import useDelete from "@/hooks/useDelete";
import useProductContext from "../hooks/useProductsContext";

export default function ProductDetails() {
  const { contextState: {dialog: {productId}}, dispatch } = useProductContext();
  const { data, loading: queryLoading } = useProducts('id=' +productId);  
  const { result, loading: deleteLoading, execute } = useDelete();
  let product = {} as Product;
  
  if(data) {
    product = data[0];
  }

  useEffect(() => {
    if(result && result.messageType === 'success') {
      const timeOutTimer = setTimeout(() => {
        // close the modal
        dispatch({
          type: 'update_modal_state',
          payload: {
            dialog: {
              isOpen: false,  
            }            
          }
        })
      }, 3000);
      return () => { clearTimeout(timeOutTimer); }      
    }
  }, [result]);

  const handleConfirmDelete = async(e) => {
    e.preventDefault();
    // calls the delete api through useDelete custom hook
    if(product && product.id) {
      execute(PRODUCT.api_url + '/' + product.id );
    }
  }   

  return (
      <div className="items-center text-left">        
        {result && result.messageType !== undefined ?
          <div className="containerof w-full">
            <div className={`custom-alert alert alert-${result.messageType}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{result.message}</span>
            </div>
          </div>:<></>
        }
        {product && (
          <>
            <div className="prod-name-desc w-full mb-5">          
              <input type="hidden" value={product.id} />
              <div className="field-row">
                <span className="center-image"><img
                  className="object-cover inline-block"
                  src={product.imageUrl ? product.imageUrl : "https://placehold.co/400x300"}
                  alt="Product title"
                  width="250"
                  height="200"
                /></span>
              </div>
              <div className="scrollable-content">
                <div className="field-row">
                  <label className="label">Product Name:</label>
                  <span className="info">{product.name}</span>
                </div>            
                <div className="field-row">
                  <label className="label">URL Slug:</label>                
                  <span className="info">{product.slug}</span>
                </div>
                <div className="field-row">
                  <label className="label">Category:</label>
                  <span className="info">{product.category}</span>                             
                </div>    
                <div className="field-row">
                  <label className="label">Summary:</label>
                  <span className="info">{product.summary}</span>
                </div>              
                         
                <div className="field-row">
                  <label className="label">Price:</label>
                  <span className="info">${product.price}</span>
                </div>
                <div className="field-row">
                  <label className="label">SKU:</label>
                  <span className="info">{product.sku}</span>
                </div>
                <div className="field-row">
                  <label className="label">Description:</label>
                  <span className="info">{product.description}</span>
                </div>                  
                <div className="field-row">
                  <label className="label">Inventory Status:</label>
                  <span className="info">{product.inStock}</span>
                </div>     
                <div className="field-row">
                  <label className="label">Published:</label>
                  <span className="info">{product.published?'Yes':'No'}</span>
                </div>
              </div> 
            </div>
            <div className="field-row center">            
              <button className="custom-btn pink-btn sm-btn" type="submit" onClick={handleConfirmDelete}>Confirm DELETE</button>
            </div>
          </>
        )}
        { (queryLoading || deleteLoading) &&
          <div className="form-overlay">
            <Loader />
          </div>}
      </div>              
  );
}