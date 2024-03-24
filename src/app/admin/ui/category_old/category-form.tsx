"use client"

import "@/app/admin/ui/styles/form.scss"
//import { useEffect, useRef, useReducer } from "react"
//import { reducer } from "@/reducers/categoryReducer"
import { Category, CategoryForm, FormPrompt } from "@/types/category"
import { validateCategory } from "@/app/admin/utils/categoryHelpers";
//import * as ACTIONS from "@/constants/category"
//import { isObjectEmpty, isObjectNullOrEmpty } from "@/utils/helpers"
//import { setPropOnloadState, updateCategory, getSlugOfCategory, 
//  updateCategoryList, updateCategorySlug, updateCategoryField, 
//  resetToInitialState, convertSlugToID } from "@/actions/categoryActions"

import useData from '@/app/admin/hooks/useData';
import FieldRow from '@/app/admin/ui/components/form/field-row';

/**
 * Reason for calling the Actions first where data are only formatted to be the data for the dispatchers.
 * - It's true that Action Maker only creates additional layer of complexity for such a simple task.
 * - However, what we really want here is CONSISTENCY. 
 * - Inside the Action maker, we can add different tasks like formatting, filter, service/API calls.
 * - Another advantage of Action maker is for the function name itself to descriptive of what the data is before dispatching.
 * - As much as posssible, we only return data from Action Maker while having the component do the dispatching.
 * - But for complex tasks that involves multiple updates to the state, we pass the dispatcher
 */


const formData: CategoryForm = {
  id: 0,
  name: '',
  slug: '',
  description: ''
}

type CategoryFormProps = {
  propState: any;
  resetProps(): void;
  categoryList: Category[];
}
const CategoryForm = () => {
  const id = 0;
  const isProcessing = false;
  
  // {propState, resetProps, categoryList}: CategoryFormProps
  /*
  const [state, dispatch] = useReducer(reducer, ACTIONS.INITIAL_CATEGORY_STATE);
  const { id, name, slug, description, parent } = state.category;
  const { isProcessing, message, messageType, slugHasChanged } = state.form;
  const { categories, componentStatus } = state;
  const parentRef = useRef<HTMLSelectElement | null>(null);

  
  useEffect(() => {
    console.log('The State: ', state);

    if(!isObjectNullOrEmpty(propState)) 
      dispatch(setPropOnloadState({propState, 
        parentCategory: getSlugOfCategory(propState.parent, categories)}));

    dispatch(updateCategoryList(categoryList));
  },[propState]);
  
  async function handleFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) {    
    e.preventDefault();

    updateCategory({
      dispatch, 
      categoryData: {
        id: id,
        name: name,
        slug: slug,
        description: description,
        parent: (parent === 0) ? 0 :  convertSlugToID(parent, categories) 
      },
      resetProps
    });  
  }  

  const handleSlugBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if(!slugHasChanged || slug.trim() === '')
      dispatch(updateCategorySlug({slug: name.replace(/\s+/g, '-').toLowerCase(), slugHasManuallyChanged: false}));
    
  }  
  const handleResetForm = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    dispatch(resetToInitialState());    
    resetProps(); // for the parent component to do a data refresh
  };

  const handleOnChange = (value: string | number, fieldName: string) => {
    if(fieldName !== 'slug') return dispatch(updateCategoryField({fieldName, value}));

    dispatch(updateCategorySlug({
      slug: (typeof value === 'string' ? value.replace(/\s+/g, '-').toLowerCase(): value.toString()), 
      slugHasManuallyChanged: true
    }));
  } 
  */


  function handleFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) { 
    e.preventDefault();
    const [name,] = useData('name', {name: ''});  
    const [slug,] = useData('slug', {slug: ''});  
    const [formMessage, setFormMessage] = useData('formMessage', {
      formMessage: {
        message: '', 
        type: ''
      } as FormPrompt
    });
    
    // let's process the submit

    // DO MANUAL VALIDATION.
    const formError = validateCategory( {name: name, slug: slug});
    if(formError.length) {
      setFormMessage({
        message: formError.map(m=>'<div>' + m + '</div>'),
        type: 'error'
      });
      return;
    }
      /*
    const result = await doUpdateCategory(categoryData);  
    if(result.status === 'NOK') 
      return dispatch(failedCreate(result.message));
    
    // update the form to display the message
    dispatch(successfullyCreated(result.message));

    // give the success message 3 seconds
    setTimeout(() => {    
      dispatch(resetCategoryState());    
      resetProps(); // callback to the parent of NewCategoryForm component
    }, 3000);
    */

  }
  const handleOnChange = (value: string | number, fieldName: string) => {

  }

  const handleResetForm = () => {

  }

  return (
    <div id="category-form" className="form card">
      <div className="card-body items-center text-center">
        <h2 className="card-title"><FormTitle /></h2>
        <FormMessage />
          <form>
            {/*
            <input type="hidden" value={id} />
            <div className="field-row">
              <label className="label">
                <span className="label-text">Parent Category {parent}</span>
              </label>            
              <select ref={parentRef} value={parent} onChange={e=>handleOnChange(e.target.value, 'parent')}>
                <option value="0">None</option>
                {categories.map((_category: Category) => <option key={_category.id} value={_category.slug}>{_category.name}</option>)}
              </select>

            </div>
            */}
            <FieldRow {...{
              field: 'name',
              label: 'Category Name',
              type: 'input',
              placeholder: 'Category name',
              required: false
              }} />
            <FieldRow {...{
              field: 'slug',
              label: 'Category URL Slug',
              type: 'input',
              placeholder: 'URL Slug',
              required: false
              }} />
            <FieldRow {...{
              field: 'description',
              label: 'Description',
              type: 'textarea',
              placeholder: 'More details ...',
              required: false
              }} />
            {/**}
            <div className="field-row">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input 
                type="text" 
                placeholder="category name"
                onChange={e=>handleOnChange(e.target.value, 'name')}
                onBlur={handleSlugBlur}
                value={name}
                required />            
            </div>
            <div className="field-row">
              <label className="label">
                <span className="label-text">Category URL Slug</span>
              </label>
              <input 
                type="text" 
                placeholder="slug"
                onChange={e=>handleOnChange(e.target.value, 'slug')} 
                onBlur={handleSlugBlur}
                value={slug}
                required />             
            </div>
            <div className="field-row">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                placeholder="More details ..."
                name="categoryDescription"
                onChange={e=>handleOnChange(e.target.value, 'description')}
                value={description} />
              <label className="label">
                <span className="label-text-alt">Write some specifics about the limit or scope of the topic</span>
              </label>
            </div>
            */}
            <div className="field-row text-left">
              <FormResetButton />
              <FormSubmitButton/>
            </div>
              
          </form>          
      </div>
    </div>
  )
}

const FormTitle = () => {
  const [id,] = useData('id', {id: 0});
  return (
    <>
      { id ? 'Update' : 'New' } Category
    </>
  )
}
const FormResetButton = () => {
  const [id,] = useData('id', {id: 0});
  const handleResetForm = (event: React.MouseEventHandler<HTMLButtonElement>) => {

  }
  return <button
    className={`${!id?'hidden':'custom-btn'}`} 
    type="reset" 
    title="Clears the Form to allow new category entry"
    onClick={handleResetForm}>Reset</button>
}
const FormSubmitButton = () => {
  const [id,] = useData('id');
  const [isProcessing,] = useData('isProcessing');
  const [name,] = useData('name', {name: ''});  
    const [slug,] = useData('slug', {slug: ''});  
    const [formMessage, setFormMessage] = useData('formMessage', {
      formMessage: {
        message: '', 
        type: ''
      } as FormPrompt
    });


  const handleOnClick = (e) => {    
    // let's process the submit

    // DO MANUAL VALIDATION.
    const formError = validateCategory( {name: name, slug: slug});
    if(formError.length) {
      setFormMessage({
        message: formError.map(m=>(<div>{m}</div>)),
        type: 'error'
      });
      return;
    } else {
      // reset the error message just in case there was a previous error
      setFormMessage({
        message: '',
        type: ''
      });
    }
  }

  return <button 
    onClick={handleOnClick}
    type="button"
    className="custom-btn"
    disabled={isProcessing}>{
      isProcessing 
      ? '....' 
      : id
        ? 'Update':
        'Create'
    }</button>
}

const FormMessage = () => {
  const [formMessage,] = useData('formMessage', {
    formMessage: {
      message: '', 
      type: ''
    } as FormPrompt
  });
  return (
    formMessage.message?
      <div className="containerof w-full">
        <div className={`custom-alert alert alert-${formMessage.type}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{formMessage.message}</span>
        </div>
      </div>:<></>
  )
}

export default CategoryForm;