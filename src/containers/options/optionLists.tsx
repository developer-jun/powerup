import React, { useState, useReducer, useEffect } from 'react';
import { Option, OptionAndItems } from '@/types/option';
import { optionReducer } from '@/app/admin/reducers/optionReducer';
import { getDefaultOptionState, optionCreation, addItemsToOption, optionModificationEnd, updateOption } from '@/actions/optionActions';
import OptionItems from './optionItems';
// import OptionTitle from './optionTitle';
import { HIDE_OPTION_FORM, SHOW_OPTION_FORM, UPDATE_OPTION } from '@/constants/options';
import { OptionTitle, OptionTitleForm } from './optionSubContents';

type CategoriesProps = {
  editCategory(category: Category): void,
  resetProps(): void,
  total: number,
  categories: CategoryHierarchy[],
}
type OptionListsProps = {
  options: OptionAndItems[],
  resetProps(): void,
}
export default function OptionLists({ options, dataChangeCounter }: OptionListsProps{options: OptionAndItems[], dataChangeCounter: number}) {  
  const [state, dispatch] = useReducer(optionReducer, getDefaultOptionState());
  const [focusedOption, setFocusedOption] = useState({} as Option);
  // console.log('optionList', optionsList);
  //let { option_name, option_description } = state.option;

  useEffect(() => {
   // a very good use case for useeffect that triggers everytime theres change in the state 
   // we are listening to the value of the state form for changes
   if(state.form.messageType === 'success' && state.form.action === 'complete') {
    optionsList.push(addItemsToOption(state.option));
    dispatch(optionModificationEnd());
   }
  }, [state.form.messageType, state.form.action]); 

  //option_name = option_name !== 'undefined' ? option_name : '';
  //option_description = option_description !== 'undefined' ? option_description : '';

  // used as a callback to set value to our selected option from a subcomponent
  const subSetFocusedOption = (option: OptionAndItems) => {
    setFocusedOption(option);
  }
  /*
    <OptionLists />
    ...<OptionTitle />
    ...<OptionTitleForm />

    ...<OptionItems />
    ...<OptionForm /> 

   */


  return (
    <div className='option-lists'>
      { optionsList && optionsList.map(option => {
          return (
            <div className='option-item' key={ option.option_id }>                
              { focusedOption.option_id === option.option_id 
                ? <>
                    <OptionTitle option={option} setNewFocused={subSetFocusedOption} isSelected={true} />
                    <OptionTitleForm option={focusedOption} setNewFocused={subSetFocusedOption} />
                  </>
                : <OptionTitle option={option} setNewFocused={subSetFocusedOption} isSelected={false} />
              }
              { option.optionitem && option.optionitem.length > 0 
                  ? <OptionItems optionItem={option.optionitem} />
                  : <span>No Items defined yet.</span> 
              }
            </div>
          )
        })
      }
    </div>       
  )
}
