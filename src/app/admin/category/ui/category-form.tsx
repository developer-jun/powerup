"use client"

import "@/app/admin/category/styles/form.scss"
import { useRef, useReducer, useState, useEffect, memo, useMemo } from "react"
import { reducer } from "@/app/admin/reducers/categoryFormReducer"
import { Category, CategoryHierarchy, CategoryForm, FormState, DropdownOption } from "@/types/category"
import { MessagePrompt } from '@/types/common';
import { validateCategory, createDropdownOptions } from "@/app/admin/utils/categoryHelpers";
import FormMessagePrompt from './formMessagePrompt';
import Loader from '@/components/blocks/loader';
import * as ACTIONS from "@/constants/category";

import useCategory from '../../hooks/useCategoryContext';
import useSubmitData from "@/app/admin/hooks/useFormSubmit";

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

const formState: FormState = {
  isProcessing: false, 
  hasSlugManuallyChanged: false
}

const messagePrompt: MessagePrompt = {
  messageType: undefined,
  message: ''
}
const initCategoryFormValues = {
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
    hasSlugManuallyChanged: false,
  },
  alertPrompt: messagePrompt
}

/*
type CategoryFormProps = {
  propState: any;
  resetProps(): void;
  categoryList: Category[];
}
*/

// TODO: Refactor to conform with Single Responsibility Principle. 
const CategoryForm = ({refreshCategories}: {refreshCategories: () => void}) => {
  const { state:{ categories, hierarchedCategories, selectedCategory }, storeCategory } = useCategory(); // context data source 
  const { submitData } = useSubmitData();
  
  // local state variables, manages the form data, forms states and the messages
  // if user has selected a category to be edited, we passed that info to this local state from it's context source
  // we just want to localized it, that way when we edit the category, our sibling component which by the way the list of all Categories, does not get re-rendered.
  // the only time we notify the parent context of changes is when we are done editing, that the form has already been submitted to the server and that the context needs to retrieved the new updated data from the server.
  const submitButtonRef = useRef('Create');
  const [ state, dispatch ] = useReducer(reducer, initCategoryFormValues);  
  const { alertPrompt } = state;
  const { id, name, slug, description, parent } = state.category as CategoryForm;
  const { isProcessing, hasSlugManuallyChanged } = state.form as FormState;  
  
  if(id) {
    submitButtonRef.current = 'Update';
  } else {
    submitButtonRef.current = 'Create';
  }
  // is there a better place to update our local state when the user selects a category to edit?
  // for now this seems to be the best place to do it
  useEffect(() => {    
    dispatch({
      type: ACTIONS.UPDATE_PARENT_OBJECT,
      payload: [{
        fieldName: 'category',
        data: selectedCategory === null ? formDataStructure : selectedCategory,
      }]
    });
    
  }, [selectedCategory]); 
  
  let dropdownOptions: DropdownOption[] = useMemo(() => createDropdownOptions(hierarchedCategories), [hierarchedCategories && hierarchedCategories]);

  async function handleFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) {    
    e.preventDefault();
    const displayDelay = 3000; // 3 seconds
    // let everyone know that the process has begun
    dispatch({ 
      type: ACTIONS.UPDATE_CATEGORY_START,
      payload:[{ 
        parent: 'form',
        field: {
          fieldName: 'isProcessing',
          data: true,
        },
      }]
    });

    // Step 1: VALIDATION
    // DO MANUAL VALIDATION.
    const fieldErrors = validateCategory({name, slug});
    if(fieldErrors.length) {
      dispatch({ 
        type: ACTIONS.UPDATE_CATEGORY_VALIDATION_ERROR,
        payload:[{ 
          parent: 'form',
          field: {
            fieldName: 'isProcessing',
            data: false,
        }}, {
          fieldName: 'alertPrompt',
          data: {
            messageType: 'error',
            message: fieldErrors.join('<br />'),
          },          
        }]
      });
      return; // terminate abruptly
    }

    let categoryData: CategoryForm = state.category;

    // check if the user hasn't touched the Parent Category, because if the dropdown did not changed, it will remain 0 which we did not want.
    if(parent === 0) {
      const parentCategory = hierarchedCategories.find(_category => _category.parent === null);
      if(parentCategory && parentCategory.id) {
        categoryData.parent = parentCategory.id;
      }
    }

    // STEP 2: API Call
    submitData('/api/categories/', categoryData)
      .then((result) => {
        let resultPrompt: MessagePrompt = {
          messageType: 'success',
          message: 'Category was successfully ' + ((state.category.id > 0) ? 'Updated' : 'Created'),
        }
        if (typeof result === 'string') {
          resultPrompt = {
            messageType: 'error',
            message:result as string
          };                    
        } else {
          //if(selectedCategory) storeCategory(null); // reset user selected category
        }
        // This should cause the message to show
        dispatch({
          type: ACTIONS.UPDATE_MULTI_STATE_PARENT_OBJECTS,
          payload:  [{ 
            parent: 'form',
            field: {
              fieldName: 'isProcessing',
              data: false,
          }}, 
            {                 
              fieldName: 'alertPrompt',
              data: resultPrompt,                
            }]
        });       
        // but we also have to limit it to only 5 seconds, after that, we set it back to undefined
        // another thing, we need to empty the form as well, so we need to employ a setTimeout functionality
        setTimeout(() => {
          // ONLY update the FORM and set to to empty if the submission is successful, we want to user to continue editing if error message was found.
          if(resultPrompt.messageType === 'success') {
            dispatch({
              type: ACTIONS.UPDATE_MULTI_STATE_PARENT_OBJECTS,
              payload:  [{                
                  fieldName: 'form',
                  data: formDataStructure,                
                }, 
                {                 
                  fieldName: 'alertPrompt',
                  data: messagePrompt,                
                },
                {
                  fieldName: 'category',
                  data: formDataStructure
                }
              ]
            });
            // let call the parent Component to refetch the category list since we just made changes to it.
            refreshCategories();
            // empty the user selected category
            if(selectedCategory)
              storeCategory(null);
          }
          
        }, displayDelay);
      });

    console.log('Finished Processing the Form');
  }  

  const handleOnBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // we needed to know if slug has been manually changed, if so don't bother
    // but if the slug is empty, then were free to modify it
    if(hasSlugManuallyChanged && slug.trim() !== '') return;
    console.log('blur triggered');
    dispatch({
      type: ACTIONS.UPDATE_CATEGORY_FIELD,
      payload: [{
        parent: 'category',
        field: {
          fieldName: 'slug', 
          data: name.replace(/\s+/g, '-').toLowerCase(),
        }
      }]
    });
  }
  
  const handleFormReset = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();    
    
    dispatch({
      type: ACTIONS.UPDATE_STATE, 
      payload: ACTIONS.INITIAL_CATEGORY_STATE // is an empty Category object
    });

    // reset the context selectedCategory as well only if it has current value
    if(selectedCategory)
      storeCategory(null);
  };

  const handleOnChange = (value: string | number, fieldName: string) => {
    dispatch({
      type: ACTIONS.UPDATE_CATEGORY_FIELD,      
      payload: [{
        parent: 'category',
        field: {
          fieldName: fieldName, 
          data: value
        }
      }]
    });
  }

  const handleSlugOnChange = (value: string) => {
    if(!hasSlugManuallyChanged) {
      dispatch({
        type: ACTIONS.UPDATE_MULTI_STATE_OBJECTS,
        payload:  [
          {
            parent: 'category',
            field: {
              fieldName: 'slug',
              data: (typeof value === 'string' ? value.replace(/\s+/g, '-').toLowerCase() : value),
            }
          }, { 
            parent: 'form',
            field: {
              fieldName: 'hasSlugManuallyChanged',
              data: true,
            },
          },
        ]
      });
    } else {
      dispatch({
        type: ACTIONS.UPDATE_CATEGORY_FIELD,         
        payload: [{
          parent: 'category',
          field: {
            fieldName: 'slug', 
            data: value
          }
        }]
      });
    }
  }  

  return (
    <div id="category-form" className="form card">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{ id ? 'Update' : 'New' } Category</h2>
          {alertPrompt.messageType !== undefined ? <FormMessagePrompt {...alertPrompt} /> :<></> }    
          <form onSubmit={handleFormSubmit}>            
            <input type="hidden" value={id} />        
            <div className="field-row">
              <label className="label">
                <span className="label-text">Parent Category</span>
              </label>              
              <select value={parent} onChange={e => handleOnChange(parseInt(e.target.value), 'parent')}>                
                {dropdownOptions && dropdownOptions.map((option, index) => 
                  {
                    if(option.value !== id)
                      return <option key={index} value={option.value}>{option.label}</option> 
                  }
                )}
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
                onChange={e=>handleSlugOnChange(e.target.value)} 
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
                onClick={handleFormReset}>Reset</button>&nbsp;
              <button                 
                    type="submit"
                    className="custom-btn"
                    >{submitButtonRef.current}</button>

            </div>
            
            { isProcessing &&
              <div className="form-overlay">
                <Loader />
              </div>}
          </form>
      </div>
    </div>
  )
}

export default CategoryForm;