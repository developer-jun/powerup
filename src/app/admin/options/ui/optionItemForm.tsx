import React, { useReducer } from 'react'
import { optionReducer } from '../../reducers/optionReducer';
import { StateProps } from '@/types/option';

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
export default function OptionForm() {
  const [optionState, dispatch] = useReducer(optionReducer, initialState); // getDefaultOptionState({option: preSelected, formControl: formToggle})
  const {formControl, form, option} = optionState;
  return (
    <>
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
    </>
  )
}
