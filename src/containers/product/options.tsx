// 'use client'

import React from 'react'
import OptionForm from '../options/optionGroupForm'
import OptionLists from '../options/optionLists'
import { OptionAndItems } from '@/types/option'
import '@/containers/styles/options.scss';

export default function ProductOptions({ options }: {options: OptionAndItems[] }) {
  
  // Used solely to update the Options 
  const fetchOptions = (newOption: OptionAndItems) => {    
    options.push(newOption);
  }

  return (
    <>
      <div className="flex full-width">
        <div className="flex-width-one-third">
          <OptionLists           
            optionsList={options as OptionAndItems[]} />             
        </div>       
      </div>
    </>    
  )
}
