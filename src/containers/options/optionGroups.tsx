"use client";


import React, { useEffect, useState } from 'react'
import { Option, OptionAndItems, OptionWithItems } from '@/types/option';
import useToggler from '@/hooks/useToggler';
import '@/containers/styles/options.scss';



import OptionGroupForm from './optionGroupForm';
/*
import OptionLists from '@/containers/options/optionLists'

import OptionItems from './optionItems';

// import { OptionTitle, OptionTitleForm } from './optionSubContents';

type OptionsGroupProps = {
  optionsGroups: OptionAndItems[],
}
export default function OptionListsContents({ optionsGroups }: OptionsGroupProps) {
  const [dataChangeCounter, setDataChangeCounter] = useState(0);

  const dataChanged = (action: string, optionData: Option) => {
    console.log('Forcing a data change');
    optionsGroups.push(optionData as OptionAndItems);
    setDataChangeCounter(count=>count+1);
  }

  // the two most important components below are the Option Lists and the Option Form
  // they are in their own components since they too have local states of their own.
  // one important connection of the two however is, when user is DONE using the form, we should be able to update the Option Lists component to refresh it's data.
  // hence we have a callback function in this component to let the Option Lists component know about the changes.
  return (
    <>
      <OptionItems options={optionsGroups} refreshCounter={dataChangeCounter}>
        <OptionGroupForm updateParentOfChanges={dataChanged} preSelected={{} as OptionAndItems} />      
      </OptionItems>           
    </>
  )
}
*/
type OptionsGroupProps = {
  optionsGroups: OptionAndItems[],
}

export default function OptionGroups({ optionsGroups }: OptionsGroupProps) {
  // const createFormToggle = useToggler(true);
  const editFormToggle = useToggler(false);
  // const [state, dispatch] = useReducer(optionReducer, getDefaultOptionState());
  const [selectedOption, setSelectedOption] = useState({} as Option);
  const [formControl, setFormControl] = useState({ button: true, form: false}); // this will control which form is open, by default both should be closed or hidden
  const [updateFormControl, setUpdateFormControl] = useState(false);

  useEffect(() => {
    console.log('formControl: ', formControl);
  });
  

  const selectOption = (option: OptionAndItems) => {
    setSelectedOption(option);
    if(formControl.form) setFormControl({ button: true, form: false});
    //createFormToggle.switchToggle();
    console.log('option selected: ',option);
  }

  const dataChanged = (handle: string, action: string, optionData: Option) => {
    if(action === 'cancel') {
      if(handle === 'create') 
        setFormControl({button: true, form: false})        

      if(handle === 'update') 
        setSelectedOption(optionData);
    }

    
    //setFocusedOption.push(optionData as OptionAndItems);
    //setDataChangeCounter(count=>count+1);
  }

  const showCreateOptionForm = () => {
    //createFormToggle.switchToggle();
    setFormControl({button: false, form: true});
  }

  return (
    <>
      <div className='option-lists'>
        { 
          optionsGroups && optionsGroups.map(option => {
            return (
              <div className='option-item' key={ option.option_id }>                
                { selectedOption.option_id === option.option_id 
                  ? <>
                      {/*<h4>{option.option_name}</h4> <a className="inline-btn" title="Cancel Editing" href="#" onClick={e=>selectOption({} as Option)}><svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></a>*/}
                      {/* The Edit FORM */}
                      <OptionGroupForm 
                        handle="update" 
                        updateParentOfChanges={dataChanged} 
                        formToggle={true} 
                        preSelected={selectedOption as OptionAndItems} />
                    </>
                  : <h4>{option.option_name} <a className="inline-btn" title="Edit" href="#" onClick={e=>selectOption(option)}><svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></a></h4>
                }                
              </div>
            )
          })
        }
      </div>

      {/* The Add New FORM */}
      {formControl.form 
        ? <OptionGroupForm 
            handle="create" 
            updateParentOfChanges={dataChanged} 
            formToggle={true} 
            preSelected={{} as OptionAndItems} />
        : <button onClick={showCreateOptionForm}>+ New Option</button>}
    </>
    
  )
}
