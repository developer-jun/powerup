"use client"

import { useReducer, useRef, useMemo, useEffect } from "react"
import { Product } from "@/types/product"
import { DropdownOption } from "@/types/category";
import { UploadButton } from "@/utils/uploadthing";
import { ACTIONS, productInitialState, productFormReducer, productFormInit } from "@/app/admin/reducers/productFormReducer";
import { formatSlug } from "@/app/admin/utils/helpers";
import { createHierarchy, createDropdownOptions } from "@/app/admin/utils/categoryHelpers";
import useCategories from "../../hooks/useCategories";
import useProductCRUD from "../../hooks/useProductCRUD";
import Loader from '@/components/blocks/loader';
import "./product-form.scss";
import "@/components/layout/form.scss";
import "@uploadthing/react/styles.css";

// TODO: implement the props from the parent component
type ProductFormProps = {  
  changeNotifier: (product: Product) => void,
  defaultProduct: Product | null

}

export default function ProductForm({changeNotifier, defaultProduct}: ProductFormProps) {
  const { categories } = useCategories();
  const { task, loading, message, data, setMessage } = useProductCRUD();  
  const [ state, dispatch ] = useReducer(productFormReducer, {defaultState: productInitialState, defaultProduct: defaultProduct}, productFormInit);
  const { productName, slug, summary, prodImage, price, sku, 
    description, stock, publish } = state.product;
  const { isProcessing, message: message2, messageType, slugHasChanged } = state.form;
  
  const stockRef = useRef<HTMLSelectElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null); // needed especially for the slug field.
  const formRef = useRef<HTMLFormElement | null>(null); // needed to scroll the user back to the top of the form.
  const productId = defaultProduct ? defaultProduct.id : 0;

  const formattedCategories = useMemo(() => 
    createHierarchy(categories)
  , [categories]);
  
  const dropdownOptions: DropdownOption[] = useMemo(() => 
    createDropdownOptions(formattedCategories)
  , [formattedCategories]);

  useEffect(() => {
    console.log('ProductForm useEffect: ', message);
    if(message && message.messageType !== undefined) { 
      // well only update the parent if it is a successful process (create/update).
      if(message.messageType === 'success' && data !== null) {
        changeNotifier(data); // will re-render both form and latest update components
      }

      // for update, no need to reset the form
      if(!productId) {
        const timer = setTimeout(() => {
          setMessage({messageType: undefined, message: ''});
          dispatch({
            type: ACTIONS.RESET_STATE,
            payload: productInitialState
          })
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [message]); // useProductCRUD variable, this will let us know if our UPDATE or CREATE API call has been completed.

  const handleSubmit = async(e) => {
    e.preventDefault();
    // clear existing message alert
    setMessage({messageType: undefined, message: ''});
    // construct product structure
    const formData: Product = {
      id: productId,
      name: productName,
      slug: slug,
      sku: sku,
      summary: summary,
      description: description,
      imageUrl: prodImage,
      thumbUrl: '',
      price: parseFloat(price),
      inStock: stock,
      published: publish    
    }
    // validations are either handled by the browser via required property or on the server side.
    // we could have used third party libs (react-hook-form), but we stick to next and react for simplicity.

    // we need to signal the state that has the form status that we are currently processing.
    // this will show the loading indicator

    // instead of directly calling the API fetch here, we added another layer of abstraction which will handle the API call for us and handle the result as well.
    // so .... what do we expect to happen here?
    // we call the function to handle the API
    // we also passed the form data along with it.
    // that function should do all the API stuff, we only care about the result.
    // const {error, product } = await createProductPostAction(formData); // we need to wait for the results to arrived hence the await keyword.
    //create(formData, state.category);
    if(productId) {
      task({action: 'update', product: formData, categoryId: state.category});
    } else {
      task({action: 'create', product: formData, categoryId: state.category});
    }
    // the server will return the data of the product after it's created. It's up to us how to deal with i.
    // if it's not needed, 
    // we need results, but first, we need to update the state and the form status to done.
    // either we successfully created the product or we failed and have error to display.
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } 
  
  const handleOnChange = (value: string | boolean, fieldName: string) => {
    console.log(fieldName,':', value);
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT_FIELD,      
      payload: {
        value: value,
        fieldName: fieldName
      }
    });
  }

  const handleSlugOnChange = (value: string) => {
    // for the slug field
    // is there even a scenario where the two are not the same?
    // because the slug field has an onChange event which updates the slug thus setting the values to the latest.
    console.log('Slug has been changed: ', value);    
    let newSlug = formatSlug(value);
    let slugModified = false;
    console.log(newSlug ,'!==', slug);
    if( newSlug !== slug) {      
      if (newSlug === '') {
        slugModified = false;
        console.log('Slug has been emptied')
        // slugRef.current.value = formatSlug(productName); // default value to product name
        newSlug = formatSlug(productName);
      } else {
        slugModified = true;
      }
    }
    dispatch({
      type: ACTIONS.UPDATE_FORM_STATUS,      
      payload: {
        value: slugModified,
        fieldName: 'slugHasChanged'
      }
    });
    handleOnChange(newSlug, 'slug');
  }

  const handleOnBlur = (value: string, fieldName: string) => {
    if(fieldName === 'slug') {
      let newSlug = formatSlug(value);
      // for the slug field
      // is there even a scenario where the two are not the same?
      // because the slug field has an onChange event which updates the slug thus setting the values to the latest.
      if( newSlug !== slug) { 
        let slugModified = true;
        if (newSlug === '') {
          newSlug = formatSlug(productName);
          slugModified = false;
          //e.target.value = newSlug;
          slugRef.current.value = newSlug;
        }

        dispatch({
          type: ACTIONS.UPDATE_FORM_STATUS,          
          payload: {
            value: slugModified,
            fieldName: 'slugHasChanged'
          }
        });                  
      } 
    } else {
      // from the product name field
      // let's create a slug based on the product name
      if(!slugHasChanged) {  
        let formattedSlug = formatSlug(value);
        slugRef.current.value = formattedSlug; // no choice but to use ref, because once the slug field is dirty, it cannot automatically update it's display despite value is correct for some reason             
        handleOnChange(formattedSlug, 'slug');                
      }  
    }
  }

  const handleOnSubmit = () => {
    if(!stock)
      handleOnChange(stockRef.current?.value, 'stock');
  }

  return (
    <form className="product-new-form form" onSubmit={handleSubmit} ref={formRef}>
      <div className="items-center text-left">
        <div className="sub-title-and-btn">
          <h2 className="sub-title">{productId?'Update':'New'} Product Form</h2>
          <div className="btns">
            <button
              className={`custom-btn sm-btn ${productId?'hidden':''}`} 
              type="reset">Reset</button>&nbsp;
            <button className="custom-btn pink-btn sm-btn" onClick={handleOnSubmit} type="submit">{productId?'Update':'Create'}</button>
          </div>
        </div>
        {message && message.messageType !== undefined ?
          <div className="containerof w-full">
            <div className={`custom-alert alert alert-${message.messageType}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{message.message}</span>
            </div>
          </div>:<></>
        }
        <div className="prod-name-desc w-full mb-5">
          
          <input type="hidden" value={productId} />
          <div className="field-row">
            <label className="label">Product Name</label>
            <input 
              type="text" 
              className="px-2 py-3 placeholder:text-gray-400/30" 
              required 
              placeholder="Product Name" 
              value={productName} 
              onChange={e=>handleOnChange(e.target.value, 'productName')} 
              onBlur={e=>handleOnBlur(e.target.value, 'productName')} />
          </div>            
          <div className="field-row">
            <label className="label">URL Slug</label>                
            <input 
              type="text" 
              id="slug" 
              className="px-2 py-3 placeholder:text-gray-400/30" 
              required 
              placeholder="Slug" 
              value={slug} 
              onChange={e=>handleSlugOnChange(e.target.value, 'slug')} 
              ref={slugRef} 
              onBlur={e=>handleOnBlur(e.target.value, 'slug')} />
                  
          </div>
          <div className="field-row">
            <label className="label">Category</label>
            <select className="form-control" value={state.category} onChange={e=>{
              dispatch({
                type: ACTIONS.UPDATE_PRODUCT_CATEGORY, 
                payload: e.target.value
              });
            }}>
              <option value="">All Categories</option>          
              {dropdownOptions && dropdownOptions.map((option, index) => 
                  {
                    if(option.value !== 1) /*option.value !== state.category && */
                      return <option key={index} value={option.value}>{option.label}</option> 
                  }
                )}
            </select>
          </div>    
          <div className="field-row">
            <label className="label">Summary</label>
            <textarea className="px-2 py-3 placeholder:text-gray-400/30" required value={summary} onChange={e=>handleOnChange(e.target.value, 'summary')} />
            <label className="label">
              <span className="label-text-alt">This is the short description of the product, keep it short and concise, up to 300 characters only.</span>
            </label>
          </div>              
        </div>
        <div className="additional-details">
          <h3>Product Details</h3>
          <div className="form-control w-full">
            <label className="label">Image</label>
            <img
              className="object-cover inline-block"
              src={prodImage?prodImage:"https://placehold.co/400x300"}
              alt="Product title"
              width="400"
              height="300"
            />
            {!prodImage?
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  
                  // if possible, keep track of the images that has been uploaded to the server
                  // that way, we can delete it if it's not used anymore
                  // reason is because we are using third party free tier server
                  // space is limited to 1 gig only
                  
                  if(res?.length)
                    dispatch({
                      type: ACTIONS.UPDATE_PRODUCT_FIELD,                       
                      payload: {
                        value: res[0].fileUrl,
                        fieldName: 'prodImage'
                      }
                    });
                    //setProdImage(res[0].fileUrl);
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />:<></>
            }
            <input type="hidden" value={prodImage} />
          </div>
          <div className="field-row">
            <label className="label">Price</label>
            <input className="px-2 py-3 placeholder:text-gray-400/30" type="number" placeholder="Price" value={price} onChange={e=>handleOnChange(e.target.value, 'price')} />
          </div>
          <div className="field-row">
            <label className="label">SKU</label>
            <input className="px-2 py-3 placeholder:text-gray-400/30" type="text" placeholder="SKU" value={sku} onChange={e=>handleOnChange(e.target.value, 'sku')} />
          </div>
          <div className="field-row">
            <label className="label">Description</label>
            <textarea className="px-2 py-3 placeholder:text-gray-400/30" value={description} onChange={e=>handleOnChange(e.target.value, 'description')} />
            <span className="field-note">This is the detailed description of the product</span>
          </div>                  
          <div className="field-row">
            <label className="label">Inventory Status</label>
            <select ref={stockRef} value={stock} onChange={e=>handleOnChange(e.target.value, 'stock')}>
              <option value="INSTOCK">IN STOCK</option>
              <option value="OUTOFSTOCK">OUT OF STOCK</option>
              <option value="ONBACKORDER">ON BACK ORDER</option>
            </select>
          </div>     
          <div className="field-row">
            <span className="label">Published?</span>
            <label className="checkbox" htmlFor="checkbox"><input id="checkbox" type="checkbox" placeholder="Publish" checked={publish} onChange={e=>handleOnChange(!publish, 'publish')} /><span className="indicator"></span></label>
            <span className="field-note">Unpublished entry will still be saved in the database to be revisited later.<br />
            The entry will not be viewable in the frontend.<br /> 
            Use Unpublished option to hide product from being listed in frontend, usable if product had been discontinued or information is not complete yet.<br /> 
            Unlike to when inventory status is marked 'OUT OF STOCK', 'OUT OF STOCK' products will still be displayed in the frontend, except the user can't add item to cart. However, they can still add it to their favorites.</span>
          </div>
          <div className="field-row">
            <button
              className={`custom-btn sm-btn ${productId?'hidden':''}`} 
              type="reset">Reset</button>&nbsp;
            <button className="custom-btn pink-btn sm-btn" type="submit" onClick={handleOnSubmit}>{productId?'Update':'Create'}</button>
          </div>
        </div>

        { loading &&
          <div className="form-overlay">
            <Loader />
          </div>}
      </div>              
    </form>
  );
}