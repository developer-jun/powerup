"use client"

import { useReducer, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Product, emptyProductStructure } from "@/types/product"
import "./product-form.scss";
import "@/components/layout/form.scss";
import "@uploadthing/react/styles.css";

import { UploadButton } from "@/utils/uploadthing";
import { ACTIONS, initialState, reducer } from "@/reducers/productReducer";
import { createProductPostAction } from "@/actions/productActions";

const slugFormat = (data: string) : string => {
  return data.replace(/[^a-zA-Z0-9- ]/g, "").replace(/ /g, "-").toLowerCase(); // used for the slug, exclude non-numeric chars
}

// TODO: implement the props from the parent component
type ProductFormProps = {
  product?: Product
}

export default function ProductForm(props: ProductFormProps) { 
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { productName, slug, summary, prodImage, price, sku, 
    description, stock, publish } = state.product;
  const { isProcessing, message, messageType, slugHasChanged } = state.form;
  //const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const stockRef = useRef<HTMLSelectElement | null>(null);
  const slugRef = useRef<HTMLInputElement | null>(null); // needed especially for the slug field.
  const formRef = useRef<HTMLFormElement | null>(null); // needed to scroll the user back to the top of the form.
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    stock 
    // construct product structure
    const formData: Product = {
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
    const {error, product } = await createProductPostAction(formData); // we need to wait for the results to arrived hence the await keyword.
    // the server will return the data of the product after it's created. It's up to us how to deal with i.
    // if it's not needed, 
    // we need results, but first, we need to update the state and the form status to done.
    // either we successfully created the product or we failed and have error to display.
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    console.log('FINAL RESULT');
    console.log(error, product);
    if(!product) {
      // has an error
      dispatch({
        type: ACTIONS.UPDATE_FORM_STATUSES, 
        payload: { 
          isProcessing: false,
          message: error,
          messageType: 'error',
        }
      });
    } else {
      // successfully created the product, show the confirmation message
      dispatch({
        type: ACTIONS.UPDATE_FORM_STATUSES, 
        payload: { 
          isProcessing: false,
          message: 'Product created successfully',
          messageType: 'success',
        }
      });

      // give 3 seconds show the form messages before resetting the form
      setTimeout(() => {          
        console.log('RESETTING THE STATE');
        dispatch({
          type: ACTIONS.RESET_STATE, 
          payload: initialState
        });
      }, 3000);
    }    
  } 
  
  const handleOnChange = (value: string | boolean, fieldName: string) => {
    // published is a checkbox, it needs to be boolean which is the negation of the previous value
    //if(fieldName === 'publish') {
    //  value = !publish;
    //}
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT_FIELD, 
      fieldName: fieldName, 
      payload: value
    });
  }

  const handleOnSubmit = () => {
    if(!stock)
      handleOnChange(stockRef.current?.value, 'stock');
  }

  return (
    <form className="product-new-form form" onSubmit={handleSubmit} ref={formRef}>
      <div className="items-center text-left">
        <h2 className="sub-title">{editMode?'Update':'New'} Product Form</h2>
        {message.length ?
          <div className="containerof w-full">
            <div className={`custom-alert alert alert-${messageType}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{message}</span>
            </div>
          </div>:<></>
        }
        <div className="prod-name-desc w-full mb-5">
          <div className="card-actions justify-end">
            <Button
              className={`${!editMode?'hidden':''}`} 
              type="reset">Reset</Button>
            <Button onClick={handleOnSubmit} type="submit">{editMode?'Update':'Create'}</Button>
          </div>
          <input type="hidden" value="0" />
          <div className="field-row">
            <label className="label">Product Name</label>
            <input 
              type="text" 
              className="px-2 py-3 placeholder:text-gray-400/30" 
              required 
              placeholder="Product Name" 
              value={productName} 
              onChange={e=>handleOnChange(e.target.value, 'productName')} 
              onBlur={(e) => {
                // let's create a slug based on the product name
                if(!slugHasChanged) {  
                  let formattedSlug = slugFormat(e.target.value);
                  slugRef.current.value = formattedSlug; // no choice but to use ref, because once the slug field is dirty, it cannot automatically update it's display despite value is correct for some reason             
                  handleOnChange(formattedSlug, 'slug');                
                }                 
            }} />
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
              onChange={e=>handleOnChange(e.target.value, 'slug')} 
              ref={slugRef} 
              onBlur={(e) => {
                let newSlug = slugFormat(e.target.value);
                if( newSlug != slug) {
                  let slugModified = true;
                  if (newSlug === '') {
                    newSlug = slugFormat(productName);
                    slugModified = false;
                    e.target.value = newSlug;
                  }
                  /*              
                  dispatch({
                    type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                    fieldName: 'slug', 
                    payload: newSlug, 
                  });
                  */
                  dispatch({
                    type: ACTIONS.UPDATE_FORM_MISC, 
                    fieldName: 'slugHasChanged', 
                    payload: slugModified
                  });                  
                }                  
            }} />
                  
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
                      fieldName: 'prodImage', 
                      payload: res[0].fileUrl
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
            <label className="checkbox" htmlFor="checkbox"><input id="checkbox" type="checkbox" placeholder="Publish" value={publish} onChange={e=>handleOnChange(!publish, 'publish')} /><span className="indicator"></span></label>
            <span className="field-note">Unpublished entry will still be saved in the database to be revisited later.<br />
            The entry will not be viewable in the frontend.<br /> 
            Use Unpublished option to hide product from being listed in frontend, usable if product had been discontinued or information is not complete yet.<br /> 
            Unlike to when inventory status is marked 'OUT OF STOCK', 'OUT OF STOCK' products will still be displayed in the frontend, except the user can't add item to cart. However, they can still add it to their favorites.</span>
          </div>
          <div className="field-row">
            <Button
              className={`${!editMode?'hidden':''}`} 
              type="reset">Reset</Button>
            <Button type="submit" onClick={handleOnSubmit}>{editMode?'Update':'Create'}</Button>
          </div>
        </div>
      </div>              
    </form>
  );
}