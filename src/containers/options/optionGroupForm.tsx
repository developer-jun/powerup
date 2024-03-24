import React, { useEffect, useReducer } from 'react'
import { Option, OptionAndItems } from '@/types/option';
import { optionReducer } from '@/app/admin/reducers/optionReducer';
import { getDefaultOptionState, addItemsToOption, updateOption } from '@/actions/optionActions';
import { HIDE_OPTION_FORM, SHOW_OPTION_FORM, UPDATE_OPTION_FIELD, UPDATE_OPTIONS } from '@/constants/options';
import Alert from '@/components/blocks/alert';
import { isEmpty } from '@/utils/helpers';

type OptionFormProps = {
  handle: string; // identifier of whose calling it from
  updateParentOfChanges(handle:string, action: string, optionData: OptionAndItems): void,
  formToggle: boolean,
  preSelected: OptionAndItems // There are two instances where this component is used, both adding new OptionGroup and updating existing Option hence it has preselection.
}
export default function OptionGroupForm({handle, updateParentOfChanges, formToggle, preSelected}: OptionFormProps) {
  const [optionState, dispatch] = useReducer(optionReducer, getDefaultOptionState({option: preSelected, formControl: formToggle}));
  const {formControl, form, option} = optionState;

  const processOption = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();    
    
    let optionData: Option = (!isEmpty(preSelected))
      ? option
      : {
          option_name: option.option_name, 
          option_description: option.option_description
        }; // prisma has issue with inserting data while giving it an id of 0, must remove the default option_id attribute

    const createResult = await updateOption({dispatch, optionData})

    if(createResult)      
      updateParentOfChanges(handle, 'create', createResult as OptionAndItems);
    else
      console.error('Option action failed');
  }
  
  // two thing will happen:
  // 1. hide the form
  // 2. notify the parent of the action
  const cancelForm = () => {    
    dispatch({type: HIDE_OPTION_FORM})
    updateParentOfChanges(handle, 'cancel', {} as OptionAndItems);
  }

  return (
    <div className={'option-form-wrap'}>
      {(formControl)
        && <form className={`option-form ${form.action}`}>
            {(form && form.action === 'complete')
              && <Alert messageType={form.messageType} message={form.message} />}

            <div className="form-fields">
              <input type="text" value={option.option_name} onChange={e=>dispatch({
                type: UPDATE_OPTION_FIELD, 
                fieldName: 'option_name', 
                payload: e.target.value
              })} placeholder='Option Name' />
              <input type="text" value={option.option_description} onChange={e=>dispatch({
                type: UPDATE_OPTION_FIELD, 
                fieldName: 'option_description', 
                payload: e.target.value
              })} placeholder='Option Description' />
            </div>
            <div className="buttons">
              <button onClick={processOption}>{handle.toUpperCase()} Option</button>
              &nbsp;&nbsp;&nbsp;<button onClick={cancelForm}>Cancel</button>
            </div>
          </form>
        /*: (!isEditing() && <button onClick={(e) => {dispatch({type: SHOW_OPTION_FORM})}}>+ New Option</button>)*/
      }
    </div>
  )
}

{/*<div id="category-form">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{ id ? 'Update' : 'New' } Category</h2>
        {message?
          <div className="containerof w-full">
            <div className={`custom-alert alert alert-${messageType}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{message}</span>
            </div>
          </div>:<></>
        }
          <form onSubmit={handleFormSubmit}>
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
            <div className="field-row text-left">
              <button
                className={`${!id?'hidden':'custom-btn'}`} 
                type="reset" 
                title="Clears the Form to allow new category entry"
                onClick={handleResetForm}>Reset</button>
              <button 
                type="submit"
                className="custom-btn"
                disabled={isProcessing}>{
                  isProcessing 
                  ? '....' 
                  : id
                    ? 'Update':
                    'Create'
                }</button>
            </div>
          </form>          
      </div>
              </div>*/} 