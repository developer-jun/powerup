import React, { useEffect, useReducer } from 'react'
import { Option, OptionAndItems, StateProps } from '@/types/option';
import { optionReducer } from '@/app/admin/reducers/optionReducer';
import { getDefaultOptionState, addItemsToOption, updateOption } from '@/actions/optionActions';
import { HIDE_OPTION_FORM, SHOW_OPTION_FORM, UPDATE_OPTION_FIELD, UPDATE_OPTIONS } from '@/constants/options';
import { isEmpty } from '@/utils/helpers';
import Alert from '@/components/blocks/alert';
import useOptionContext from '../../hooks/useOptionContext';


const initialState: StateProps = {
  option: {
    option_id: 0, 
    option_name: '',
    option_description: '',
  },
  componentStatus: 'init',
  formControl: false, // show / hide the option main form
  form: {
    action: 'standby', // complete, standby, processing
    message: '',
    messageType: undefined,
  }
}

type OptionFormProps = {
  handle: string; // identifier of whose calling it from
  updateParentOfChanges(handle:string, action: string, optionData: OptionAndItems): void,
  formToggle: boolean,
  preSelected: OptionAndItems // There are two instances where this component is used, both adding new OptionGroup and updating existing Option hence it has preselection.
}
export default function OptionGroupForm({handle, updateParentOfChanges, formToggle, preSelected}: OptionFormProps) {
  const [optionState, dispatch] = useReducer(optionReducer, initialState); // getDefaultOptionState({option: preSelected, formControl: formToggle})
  const {formControl, form, option} = optionState;
  const { item, setOption } = useOptionContext();

  let action = option.option_id ? 'Update' : 'Create';

  // should trigger when user selects an option from the list component
  useEffect(()=>{
    console.log('OptionGroupForm useEffect: ', item);
    let localOption = item;
    if(isEmpty(localOption)) {
      console.log('no localOption');
      localOption = {
        option_id: 0, 
        option_name: '',
        option_description: '',
      } as OptionAndItems;
    }
    dispatch({type: 'update_options', payload: localOption});
  }, [item]);

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
  const cancelForm = (e) => {
    e.preventDefault();

    // dispatch({type: 'update_options, payload: {} as OptionAndItems});
    // updateParentOfChanges(handle, 'cancel', {} as OptionAndItems);
    setOption({} as OptionAndItems);
  }

  return (
    <div className='option-form-wrap margin-top'>
      <form className={`option-form ${form.action}`}>
        <h2 className="card-title">{ action } Option</h2>
        {(form && form.action === 'complete')
          && <Alert messageType={form.messageType} message={form.message} />}
        <input type="hidden" value={option.option_id} />
        <div className="form-fields">
          <div className="field-row">
            <label>Option Name</label>
            <input type="text" value={option.option_name} onChange={e=>dispatch({
              type: UPDATE_OPTION_FIELD, 
              fieldName: 'option_name', 
              payload: e.target.value
            })} />
          </div>
          <div className="field-row">
            <label>Option Description</label>
            <textarea value={option.option_description} onChange={e=>dispatch({
              type: UPDATE_OPTION_FIELD, 
              fieldName: 'option_description', 
              payload: e.target.value
            })}></textarea>
          </div>
        </div>
        <div className="buttons">
          <button className="custom-btn" onClick={processOption}>{action} Option</button>
          &nbsp;&nbsp;&nbsp;<button onClick={cancelForm}>Cancel</button>
        </div>
      </form>
        {/*: (!isEditing() && <button onClick={(e) => {dispatch({type: SHOW_OPTION_FORM})}}>+ New Option</button>)*/}
      
    </div>
  )
}