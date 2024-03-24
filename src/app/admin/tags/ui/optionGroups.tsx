"use client";


import React, { useEffect, useState } from 'react'
import { Option, OptionAndItems, OptionWithItems } from '@/types/option';
import useToggler from '@/hooks/useToggler';
import useOptions from '../../hooks/useOptions';
import useOptionContext from '../../hooks/useOptionContext';
import '../options.scss';

import OptionGroupForm from './optionGroupForm';
import OptionLists from './optionLists';


export default function OptionGroups() {
  // const createFormToggle = useToggler(true);
  const editFormToggle = useToggler(false);
  const [selectedOption, setSelectedOption] = useState({} as Option);
  const [formControl, setFormControl] = useState({ button: true, form: false}); // this will control which form is open, by default both should be closed or hidden
  const [updateFormControl, setUpdateFormControl] = useState(false);
  const { item, items, misc, setOption, setOptions, setMisc } = useOptionContext();
  const { data, loading, message, refreshOptions } = useOptions<OptionAndItems[]>(null);
  //const misc = getMisc('refreshOptions');
  

  useEffect(() => {
    console.log('[forceRefresh]:', misc);
    if(misc.refreshOptions) {
      refreshOptions(); // allow custom hook to do it's thing
      setMisc({refreshOptions: false}); // set back to false
    }
  }, [misc]);

  useEffect(() => {
    if(data) {
      setOptions(data);
    }
  }, [data]);
  

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
 

  return (
    <>
      <div className="custom-form">
        {/* The Add New FORM */}        
          <OptionGroupForm 
            handle="create" 
            updateParentOfChanges={dataChanged} 
            formToggle={true} 
            preSelected={{} as OptionAndItems} />
      </div>
      <div className="custom-list">        
        <OptionLists />
      </div>      
    </>
  )
}
