import React, { useEffect, useReducer } from 'react'
import reducer from '@/app/admin/reducers/commonReducer';
import Alert from '@/components/blocks/alert';
import useTags from '../../hooks/useTags';
import { isEmpty } from '@/utils/helpers';
import { CommonState } from '@/types/common';
import { Tag } from '@/types/tag';

const initialState: CommonState<Tag> = {
  data: {
    tag_id: 0, 
    name: '',
    description: ''
  } as Tag,  
}

type TagFormProps = {
  updateParentOfChanges(action: string, tagData: Tag | null): void,
  preSelected: Tag // There are two instances where this component is used, both adding new OptionGroup and updating existing Option hence it has preselection.
}
export default function TagForm({updateParentOfChanges, preSelected}: TagFormProps) {
  const [ tagState, dispatch ] = useReducer(reducer<Tag>, initialState);
  const { data } = tagState;
  const { createTag, message: actionMessage } = useTags({});
  const action = data.tag_id ? 'Update' : 'Create';

  // should trigger when user selects an option from the list component
  useEffect(()=>{
    if(!isEmpty(preSelected)) {
      dispatch({type: 'set_data', payload: preSelected});
    }    
  }, [preSelected]);

  useEffect(()=>{
    if(actionMessage && actionMessage.messageType === 'success') {
      updateParentOfChanges(action, data);
    }
  }, [actionMessage]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();    
    if(!data) return;
    let tagData: Tag = (!isEmpty(preSelected))
      ? data
      : {
          name: data.name, 
          description: data.description
        }; // prisma has issue with inserting data while giving it an id of 0, must remove the default option_id attribute

    createTag(tagData);    
  }
  
  // two thing will happen:
  // 1. hide the form
  // 2. notify the parent of the action
  const handleFormCancel = (e) => {
    e.preventDefault();

    // dispatch({type: 'update_options, payload: {} as OptionAndItems});
    // updateParentOfChanges(handle, 'cancel', {} as OptionAndItems);
    setOption({} as OptionAndItems);
  }
  
  console.log('[actionMessage] ', actionMessage);
  
  return (
    <div className='option-form-wrap margin-top'>
      <form className='option-form'>
        <h2 className="card-title">{ action } Tag</h2>
        {(actionMessage && actionMessage.messageType !== undefined)
          && <Alert {...actionMessage} />}
        <input type="hidden" value={data.tag_id} />
        <div className="form-fields">
          <div className="field-row">
            <label>Tag Name</label>
            <input type="text" value={data.name} onChange={e=>dispatch({
              type: 'set_field', 
              payload: {name: e.target.value}
            })} />
          </div>
          <div className="field-row">
            <label>Tag Description</label>
            <textarea value={data.description} onChange={e=>dispatch({
              type: 'set_field', 
              payload: {description: e.target.value}
            })}></textarea>
          </div>
        </div>
        <div className="buttons">
          <button className="custom-btn" onClick={handleSubmit}>{action} Tag</button>
          &nbsp;&nbsp;&nbsp;<button onClick={handleFormCancel}>Cancel</button>
        </div>
      </form>      
    </div>
  )
}
