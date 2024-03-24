"use client"

import { useEffect, useReducer, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Product, emptyProductStructure } from "@/types/product"
import "./product-form.scss";
import "@/components/layout/form.scss";
import "@uploadthing/react/styles.css";

import { UploadButton } from "@/utils/uploadthing";
import { ACTIONS, initialState, reducer } from "@/reducers/productReducer";
/*
const reducer = (state, action) => {
  // reducer is a pure function
  // we are not modifying the state here, that's against pure function
  // rather, we are creating a new object and return it.
  // the returned object will now be the new state value
  // this is the main purpose of reducer, it's a function with some logic to create a new state object which when returned will replace the new state
  // this is where spread operator is very useful, why is that? simply because we still need the original state value or properties, we only update what needs to be updated.
  switch(action.type) {
    case 'forminput': // single field
      console.log(action.fieldName,":", action.payload);
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    case 'MULTI': // multiple fields
      // reset state values will fall into this case
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

const initialState = {
  // product attributes
  productName: '',
  slug: '',
  summary: '',
  prodImage: '',
  price: 0,
  sku: '',
  description: '',
  stock: '',
  publish: false,

  // form misc.
  isLoading: false,
  error: '',
  slugChanged: false 
};
*/

export default function ProductNewForm(props) { 
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { productName, slug, summary, prodImage, price, sku, 
    description, stock, publish } = state.product;
  const { isLoading, error, slugChanged } = state.form;


  // const [product, setProduct] = useState(emptyProductStructure());
  // const [prodImage, setProdImage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const slugRef = useRef();
  
  // const { register, handleSubmit } = useForm();
  
  useEffect(() => {
    console.count("component render: ");
    console.log(state);
    console.log("slug:",slug);
  }, []);

  const slugFormat = (data: string) : string => {
    return data.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-").toLowerCase(); // used for the slug, exclude non-numeric chars
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    // construct product structure
    const productData: Product = {
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
    // we can try and add form validation here



    // send info into the server to be saved
    try {        
      const res = await fetch('http://localhost:3000/api/product', { 
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
      // const action = category.id ? 'update_categoy' : 'new_category';
      // {status: 'OK', action: 'GETALL', categories: categories}
      console.log('WHAT THE SERVER RETURNED');
      console.log(res);
      // First thing to do is check the result status
      if(!res.ok) {
        throw new Error('Request Error', { cause: {res} })
      }
      const prod = await res.json()      
      console.log("Server Response: ", prod)
      setShowSuccessMessage(true);
        
      setTimeout(() => {          
        // reset the form
        dispatch({type: ACTIONS.RESET_FIELD_VALUES, payload: initialState});
        setShowSuccessMessage(false);
        //setSlugChanged(false);
        //setEditMode(false);
        //setComponentStatus('onloaded');
        //setCategory(_category => ({...getEmptyCategoryObject()}));
        console.log('CURRENT STATE');
        console.log(state);
      }, 3000);
      // calls the parent component to do a data refresh
      // props.resetProps({action: action});
      
    } catch(error) {
      console.log('ERROR FOUND');
      console.log(error);
    }  

    return false;
  }
  

  return (
    <div className="product-new-form">
      <form className="form" onSubmit={handleSubmit}>
        
        <div className="items-center text-left">
          <h2 className="title">{editMode?'Update':'New'} Product Form</h2>
          {showSuccessMessage?
            <div className="containerof w-full">
              <div className="custom-alert alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Category successfully {editMode?'updated':'created'}!</span>
              </div>
            </div>:<></>
          }
          <div className="prod-name-desc w-full mb-5">
            <div className="card-actions justify-end">
              <Button
                className={`${!editMode?'hidden':''}`} 
                type="reset">Reset</Button>
              <Button type="submit">{editMode?'Update':'Create'}</Button>
            </div>
            <input type="hidden" value="0" />
            <fieldset className="field-row">
              <label className="label">Product Name</label>
              <input type="text" className="px-2 py-3 placeholder:text-gray-400/30" placeholder="Product Name" defaultValue={productName} onBlur={(e) => {
                console.log("slugChanged:",slugChanged);
                if(!slugChanged) {                       
                  slugRef.current.value=slugFormat(e.target.value); // no choice but to use ref, because once the slug field is dirty, it cannot automatically update it's display despite value is correct for some reason             
                  dispatch({
                    type: ACTIONS.UPDATE_PRODUCT, 
                    payload: {
                      productName: e.target.value,
                      slug: slugRef.current.value
                    }});
                } else {
                  dispatch({
                    type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                    fieldName: 'productName', 
                    payload: e.target.value 
                  });
                }
                
              }} />
            </fieldset>            
            <fieldset className="field-row">
              <label className="label">
                <span className="label-text">URL Slug</span>
              </label>                
              <input type="text" id="slug" className="px-2 py-3 placeholder:text-gray-400/30" placeholder="Slug" defaultValue={slug} ref={slugRef} onBlur={(e) => {
                console.log('OnBlur Event Triggered');
                let newSlug = slugFormat(e.target.value); // we might have to format this value to slug
                if( newSlug!= slug) {
                  let slugHasChanged = true;
                  // although the slug has changed manually, but there's still one more thing
                  // what if the user emptied the field, if the field is emptied, we neede to reset it and get the Product name again to be the basis
                  if (newSlug === '') {
                    // reset, fallback to getting the product name as the slug basis
                    newSlug = slugFormat(productName);
                    slugHasChanged = false;
                    console.log('Slug is empty');
                    console.log(newSlug);
                    /// BIG BUG that needs resolution (solved by using useRef)
                    // if we haven't modified this field manually (keyUp event), the values can be set via defaultValue={slug}
                    // however once we hit the any key except tab, any values associated to this field via the {slug} variable will not show anymore. The values on the source code will changed but the display will not. Wierd bug
                    e.target.value = newSlug; // we need to add this because we only used defaultValue attribute
                    // why? because if we used value attribute we need to provided onChange in order to update the current value, if not it's read only.
                    // So why are we using defaultValue? - to limit re-render, hence we are using onBlur, when user finished modifying the field
                  }
                  
                  console.log('Modifying Slug');
                  console.log(slug,'to:',newSlug);
                  dispatch({
                    type: ACTIONS.UPDATE_PRODUCT, 
                    payload: {
                      slug: newSlug, 
                      slugChanged: slugHasChanged
                    }});
                }                  
              }} />
                    
            </fieldset>
            <fieldset className="field-row">
              <label className="label">
                <span className="label-text">Summary</span>
              </label>
              <textarea className="px-2 py-3 placeholder:text-gray-400/30" defaultValue={summary} onBlur={(e) => {
                dispatch({
                  type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                  fieldName: 'summary', 
                  payload: e.target.value
                  })}} />
              <label className="label">
                <span className="label-text-alt">This is the short description of the product, keep it short and concise, up to 300 characters only.</span>
              </label>
            </fieldset>              
          </div>
          <div className="additional-details w-full mt-5">
            <Tabs defaultValue="tab1" orientation="vertical" className="w-full flex flex-row">
              <TabsList className="w-1/4 flex flex-col justify-start">
                <TabsTrigger value="tab1" className="text-left w-full justify-normal px-0">Product Details</TabsTrigger>
                <TabsTrigger value="tab2" className="text-left w-full justify-normal px-0">Images</TabsTrigger>
                <TabsTrigger value="tab3" className="text-left w-full justify-normal px-0">Options</TabsTrigger>
                <TabsTrigger value="tab4" className="text-left w-full justify-normal px-0">Sale Prices</TabsTrigger>
                <TabsTrigger value="tab5" className="text-left w-full justify-normal px-0">Shipping and More ...</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="grow flex flex-col">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Image</span>
                  </label>
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
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input className="px-2 py-3 placeholder:text-gray-400/30" type="number" placeholder="Price" defaultValue={price} onBlur={(e) => {
                    dispatch({
                      type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                      fieldName: 'price', 
                      payload: e.target.value
                    })}} />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">SKU</span>
                  </label>
                  <input className="px-2 py-3 placeholder:text-gray-400/30" type="text" placeholder="SKU" defaultValue={sku} onBlur={(e) => {
                    dispatch({
                      type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                      fieldName: 'sku', 
                      payload: e.target.value
                    })}} />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea className="px-2 py-3 placeholder:text-gray-400/30" defaultValue={description} onBlur={(e) => {
                    dispatch({
                      type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                      fieldName: 'description', 
                      payload: e.target.value
                    })}} />
                  <label className="label">
                    <span className="label-text-alt">This is the detailed description of the product</span>
                  </label>
                </div>                  
                <div className="form-control w-full">
                  <select defaultValue={stock} onChange={(e) => {
                    dispatch({
                      type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                      fieldName: 'stock', 
                      payload: e.target.value
                    })}}>
                    <option value="INSTOCK">IN STOCK</option>
                    <option value="OUTOFSTOCK">OUT OF STOCK</option>
                    <option value="ONBACKORDER">ON BACK ORDER</option>
                  </select>
                </div>
                <input type="checkbox" placeholder="Publish" defaultValue={publish} onChange={(e) => {
                  dispatch({
                    type: ACTIONS.UPDATE_PRODUCT_FIELD, 
                    fieldName: 'publish', 
                    payload: !publish
                  })}} />

              </TabsContent>
              <TabsContent value="tab2" className="grow">
                Tab 2                
              </TabsContent>
              <TabsContent value="tab3" className="w-auto">Tab 3</TabsContent>
              <TabsContent value="tab4" className="w-auto">Tab 4</TabsContent>
              <TabsContent value="tab5" className="w-auto">Tab 5</TabsContent>
            </Tabs>
          </div>
        </div>
               
      </form>
    </div>           
  );
}