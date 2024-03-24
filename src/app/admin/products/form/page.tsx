'use client';

import ProductForm from "@/app/admin/products/ui/product-form";
import LatestUpdates from "@/app/admin/products/ui/latest-updates";
//import { Provider } from "@/app/admin/contexts/productContext";
import "./product-form-page.scss";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import useProducts from "../../hooks/useProducts";
import useUrlParams from "../../hooks/useUrlParams";
import Loader from "@/components/blocks/loader";
//import { ContextDataProduct, Product } from "@/types/product";

export default function ProductFormPage() {
  const urlParams = useUrlParams('/admin/products');
  const querystrings = useRef(urlParams.getCurrentParams());
  //const [lazyLoad, setLazyload] = useState(false);

  let productQuerystring = '';
  if(querystrings.current && querystrings.current.id) {
    productQuerystring = 'id=' + querystrings.current.id;
  }
  const { data: product, message } = useProducts(productQuerystring);
  const [productChange, setProductChange] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // retrieve the products information from the API
  useEffect(() => {
    console.log('[ProductFormPage] useEffect');
    console.log(product);
    // messageType will be undefined if useProducts isn't done fetching, it's either success or error.
    if(message?.messageType !== undefined ) {
      if(querystrings.current && querystrings.current.id) {
        if(product) {
          setSelectedProduct(product[0]);
        } else {
          setSelectedProduct({} as Product);
        }

      }
    }
  }, [product]);

  //const product: ContextDataProduct<Product> = {products: null, selectedProduct: null};
  
  const productChangeListener = (product: Product) => {    
    if(product) {
      setProductChange(product);
    }
  }

  const handleClickBack = () => {
    //  href="/admin/product"
    urlParams.setUrlParams({});
  }

  // prevent displaying the form 
  if((querystrings.current && querystrings.current.id) && selectedProduct === null) return <div className="form-overlay"><Loader /></div>;
  return (    
    /*<Provider initialValue={product}></Provider>*/
      <div className="two-columned-content">
        <section className="form-content">
          <h1 className="title">
            <a className="custom-btn sm-btn" onClick={handleClickBack}><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Back</a> 
            &nbsp;{selectedProduct?'EDIT':'Add New'} Product
          </h1>        
          <ProductForm changeNotifier={productChangeListener} defaultProduct={product?product[0]:null} />
        </section>
        <section className="latest-updates">
          <h2 className="sub-title">Latest Updates</h2>
          <LatestUpdates changeListener={productChange} />
        </section>
      </div>
    
  );
}