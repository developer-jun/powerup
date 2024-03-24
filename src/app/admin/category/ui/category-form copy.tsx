"use client"

import "@/app/admin/category/styles/form.scss"
import { useRef, useReducer, useState, useEffect } from "react"
import { reducer } from "@/app/admin/reducers/categoryFormReducer"
import { Category, CategoryForm, FormPrompt } from "@/types/category"
import { MessagePrompt } from '@/types/common';
import { validateCategory } from "@/app/admin/utils/categoryHelpers";
import FormMessagePrompt from './formMessagePrompt';
import * as ACTIONS from "@/constants/category";

import useCategory from '../../hooks/useCategoryContext';
// import * as ACTIONS from "@/constants/category"
//import { isObjectEmpty, isObjectNullOrEmpty } from "@/utils/helpers"
//import { setPropOnloadState, updateCategory, getSlugOfCategory, 
//  updateCategoryList, updateCategorySlug, updateCategoryField, 
//  resetToInitialState, convertSlugToID } from "@/actions/categoryActions"

// import useData from '@/app/admin/hooks/useData';

/**
 * Reason for calling the Actions first where data are only formatted to be the data for the dispatchers.
 * - It's true that Action Maker only creates additional layer of complexity for such a simple task.
 * - However, what we really want here is CONSISTENCY. 
 * - Inside the Action maker, we can add different tasks like formatting, filter, service/API calls.
 * - Another advantage of Action maker is for the function name itself to descriptive of what the data is before dispatching.
 * - As much as possible, we only return data from Action Maker while having the component do the dispatching.
 * - But for complex tasks that involves multiple updates to the state, we pass the dispatcher
 */

const formDataStructure: CategoryForm = {
  id: 0,
  name: '',
  slug: '',
  description: '',
  parent: 0
}

const formState = {
  isProcessing: false, 
  hasSlugManuallyChanged: false
}

const messagePrompt: MessagePrompt = {
  messageType: undefined,
  message: ''
}
const initCategoryFormValues = () => (
  {
    category: {
      id: 0,
      name: '',
      slug: '',
      description: '',
      parent: 0
    } as CategoryForm,
    // componentStatus: 'onloaded',
    form: {    
      isProcessing: false,     
      slugHasManuallyChanged: false,
      editMode: false,
    },
    alertPrompt: messagePrompt
  }
);

type CategoryFormProps = {
  propState: any;
  resetProps(): void;
  categoryList: Category[];
}
const CategoryForm = () => {
  const {state:{ categories, selectedCategory } } = useCategory(); // context data source 

  // local state variables
  const [state, dispatch] = useReducer(reducer, initCategoryFormValues());
  const { id, name, slug, description, parent } = state.category as CategoryForm;
  const { isProcessing, hasSlugManuallyChanged } = state.form;
  // const { messageType, message } = state.alertPrompt;
  //const { categories, componentStatus } = state;
  const parentRef = useRef<HTMLSelectElement | null>(null);
  console.log('Category Form loaded');
  
  // is there a better place to update our local state when the user selects a category to edit?
  // for now this seems to be the best place to do it
  useEffect(() => {    
    dispatch({
      type: ACTIONS.UPDATE_CATEGORY,
      payload: selectedCategory
    });    
  }, [selectedCategory]);

  /*useEffect(() => {
    console.log('The State: ', state);

    if(!isObjectNullOrEmpty(propState)) 
      dispatch(setPropOnloadState({propState, 
        parentCategory: getSlugOfCategory(propState.parent, categories)}));

    dispatch(updateCategoryList(categoryList));
  },[propState]);*/
  
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

  const handleOnBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // issue, everytime the blur event happen, the dispatch triggers thus causing re-render
    if(!slugHasChanged || slug.trim() === '')
      dispatch({
        type: ACTIONS.UPDATE_CATEGORY_SLUG,
        payload: {
          slug: name.replace(/\s+/g, '-').toLowerCase(),
          slugHasManuallyChanged: false
        }
      });
  }  
  const handleResetForm = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    dispatch(resetToInitialState());    
    resetProps(); // for the parent component to do a data refresh
  };

  const handleOnChange = (value: string | number, fieldName: string) => {
    if(fieldName !== 'slug') 
      return dispatch({
        type: ACTIONS.UPDATE_CATEGORY_FIELD, 
        fieldName: fieldName, 
        payload: value
      });

    dispatch({
      type: ACTIONS.UPDATE_CATEGORY_SLUG,
      payload: {
        slug: (typeof value === 'string' ? value.replace(/\s+/g, '-').toLowerCase(): value.toString()),
        slugHasManuallyChanged: true
      }
    });
  } 
  


  function handleFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) { 
    e.preventDefault();
    /*const [name,] = useData('name', {name: ''});  
    const [slug,] = useData('slug', {slug: ''});  
    const [formMessage, setFormMessage] = useData('formMessage', {
      formMessage: {
        message: '', 
        type: ''
      } as FormPrompt
    });*/
    
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
  /*const handleOnChange = (value: string | number, fieldName: string) => {

  }

  const handleResetForm = () => {

  }*/

  const inputChange = (field: keyof typeof formData, value: string) => {
    console.log('field: ', field, ' value: ', value);
    const previousValue = formRef.current.data[field]; // might be useful for comparison
    // set the value to our storage
    formRef.current = {
      ...formRef.current, 
      data: {
        ...formRef.current.data,
        [field]: value
      }
    };

    // some side-effects to take care of.
    //if(value !== '') {
      // if the category name changes, we should also change slug since it's based from it.
      if(field === 'name' && !formRef.current.misc.hasSlugManuallyChanged) {
        console.log('changing slug');
        formRef.current = {
          ...formRef.current, 
          data: {
            ...formRef.current.data,
            ['slug']: value.replace(/\s+/g, '-').toLowerCase()
          }
        };
        triggerRerender((counter) => counter + 1);
      }

      // if the user manually changed the slug, then some things needs to happen. we must prevent category name from modifying the slug
      if(field === 'slug') {
        let slug = value.replace(/\s+/g, '-').toLowerCase();
        let hasSlugManuallyChanged = true; // why is there a need for conditional? If user manually changed the slug to his liking, we set the flag to true. But if user removed all the values, then we must return back to category name as our reference
        if(value === '') {
          slug = formRef.current.data.name.replace(/\s+/g, '-').toLowerCase();          
          hasSlugManuallyChanged = false;
        }
        formRef.current = {
          ...formRef.current, 
          data: {
            ...formRef.current.data,
            ['slug']: slug
          },
          misc: {
            ...formRef.current.misc,
            ['hasSlugManuallyChanged']: hasSlugManuallyChanged 
          }
        };
        triggerRerender((counter) => counter + 1);
      }
    //}
  }

  const shouldRerender = (field: string) => {   
    
    if(field === 'name') {
      // need to update the slug
      //if()
      triggerRerender((counter) => counter + 1);
    }

    if(field === 'slug') {
      
    }
  }
  //console.log('categories: ', categories);
  //console.log('selectedCategory: ',selectedCategory);
  //console.log('form ref: ', formRef.current);
  return (
    <div id="category-form" className="form card">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{ id ? 'Update' : 'New' } Category</h2>
        {state.alertPrompt.messageType !== undefined ? <FormMessagePrompt {...state.alertPrompt} /> :<></> }    
          <form onSubmit={handleFormSubmit}>            
            <input type="hidden" value={id} />          
            {/*
            <FieldRow {...{
              field: 'parent',
              defaultValue: formRef.current.data.parent,
              label: 'Parent Category',
              type: 'select',
              placeholder: 'None',
              required: false,
              callback: inputChange,
              addonData: categories.map((_category: Category) => <option key={_category.id} value={_category.slug}>{_category.name}</option>)
              }} />
            <FieldRow {...{
              field: 'name',
              defaultValue: name === undefined?'':name,
              label: 'Category Name',
              type: 'input',
              placeholder: 'Category name',
              required: true,
              callback: inputChange,
              addonData: null
              }} />
            <FieldRow {...{
              field: 'slug',
              defaultValue: slug === undefined?'':slug,
              label: 'Category URL Slug',
              type: 'input',
              placeholder: 'URL Slug',
              required: true,
              callback: inputChange,
              addonData: null
              }} />
            <FieldRow {...{
              field: 'description',
              defaultValue: description === undefined?'':description,
              label: 'Description',
              type: 'textarea',
              placeholder: 'More details ...',
              required: false,
              callback: inputChange,
              addonData: null
            }} />
            */}
            
            <div className="field-row">
              <label className="label">
                <span className="label-text">Parent Category</span>
              </label>
              <select value={parent} onChange={e=>handleOnChange(e.target.value, 'parent')}>
                <option value="0">None</option>
                {categories.map((_category: Category) => <option key={_category.id} value={_category.slug}>{_category.name}</option>)}
              </select>
            </div>
            
            <div className="field-row">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input 
                type="text" 
                placeholder="category name"
                onChange={e=>handleOnChange(e.target.value, 'name')}
                onBlur={handleOnBlur}
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
                onBlur={handleOnBlur}
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
            <div className="field-row text-left">
              <button
                className={`${!id?'hidden':'custom-btn'}`} 
                type="reset" 
                title="Clears the Form to allow new category entry"
                onClick={handleResetForm}>Reset</button>

              {/*disabled={isProcessing}*/}
              <button                 
                type="button"
                className="custom-btn"
                >{
                  /*isProcessing 
                  ? '....' 
                  :*/ 
                  id ? 'Update': 'Create'}</button>

            </div>
              
          </form>
      </div>
    </div>
  )
}

const FormTitle = () => {
  return (
    <>
      { id ? 'Update' : 'New' } Category
    </>
  )
}
const FormResetButton = () => {
  // const [id,] = useData('id', {id: 0});
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

export default CategoryForm;