'use client';
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { OptionItem, OptionItemState } from '@/types/option'
// import { dataHub } from "@/app/admin/utils/helpers";
import { ContextState, Miscellaneous } from '@/types/common';
import { reducer } from "@/app/admin/reducers/contextStateReducer";
import useOptions from '../../hooks/useOptions';
import { isEmpty } from '@/utils/helpers';
import Alert from '@/components/blocks/alert';
import useOptionContext from '../../hooks/useOptionContext';

interface OptionMiscellaneous extends Miscellaneous {
  toggleForm: boolean
}
const optionItemState: ContextState<OptionItem, OptionMiscellaneous> = { 
  item: {} as OptionItem,
  items: [] as OptionItem[],  
  misc: {
    message: null,
    loading: false,
    toggleForm: false,
  } as OptionMiscellaneous
}

export default function OptionItems({optionId, items}: {optionId: number, items: OptionItem[]}) {
  const [{item, items: optionItems, misc}, dispatch] = React.useReducer(reducer<OptionItem, OptionMiscellaneous>, optionItemState);
  const { createOptionItem, updateOptionItem, deleteOptionItem, message, resetMessage } = useOptions<OptionItem>({useEffectController: -1});
  const { setMisc } = useOptionContext();
  
  const doResetMessage = () => {
    resetMessage();
  }

  useEffect(() => {
    console.log('[item]:', item);
  }, [item]);

  useEffect(() => {
    console.log('[message]:', message);
    if(message && message?.messageType === 'success') {
      // refreshOptions();
      setMisc({refreshOptions: true}); // notify parent to requery options via this context variable

      // then do a self close on the form message below
      const timer = setTimeout(() => {
        //resetMessage();
        doResetMessage();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]) // listen to the result of the API call via useOptions hook
  const handleOnClick = (e) => {
    e.preventDefault();
    dispatch({type: 'SET_MISC', payload: {toggleForm: !misc.toggleForm}});
  }

  const handleOnSave = (value: string) => {
    console.log('handleOnSave:', value);
    if(item || value) {
      // check if either create or (update | delete)
      if(!isEmpty(item)) {
        if(value === '') {
          // delete
          deleteOptionItem(item);
        } else {
          // update
          updateOptionItem({ ...item, item_name: value} as OptionItem);
        }        
      } else {
        // create
        createOptionItem({item_id: 0, option_id: optionId, item_name: value} as OptionItem);
      }      
    }
  }

  const handleOnCancel = () => {
    dispatch({type: 'SET_ITEM', payload: {} as OptionItem});
    dispatch({type: 'SET_MISC', payload: {toggleForm: false}});
  }

  const editItem = (item: OptionItem) => {
    console.log('editItem:', item);
    dispatch({type: 'SET_ITEM', payload: item});
    dispatch({type: 'SET_MISC', payload: {toggleForm: true}});
  }
  
  return (
    <div className='option-list-items-wrap'>
      <div className={`option-list-items ${misc.toggleForm?'active':'inactive'}`}>
        {items && items.map((item, index)=> {
          return (
              <a key={item.item_id} className='option-list-item' onClick={e=>editItem(item)} href='#'>
                {item.item_name}, &nbsp; <span key={index} onClick={e=>editItem(item)}>Edit</span>
              </a>
        )})}
        <a className='custom-btn sm-btn collapsible-trigger' href="#" onClick={handleOnClick}>&nbsp;</a>
      </div>
      {message?.messageType !== undefined && <Alert {...message} />}
      <OptionListItemNewForm item={item} handleOnSave={handleOnSave} toggle={misc.toggleForm} handleOnCancel={handleOnCancel} />
    </div>
  )
  /*return (
    <>
      { items.map(item=> (<div>{item.item_name}</div>))
      }
    </>
  )*/
}

type OptionListItemFormProps = {
  item: OptionItem;
  handleOnSave: (str: string) => void;
  toggle: boolean;
  handleOnCancel: () => void
}
const OptionListItemNewForm = ({item, handleOnSave, toggle, handleOnCancel}: OptionListItemFormProps) => {
  const [itemName, setItemName] = useState('');
  const contentRef = useRef(null);
  const hasItem = !isEmpty(item);
  const action = hasItem ? 'Update' : 'Create';
  console.log('selected [itemName]', itemName);

  useEffect(() => {
    if(item && item.item_name) {
      setItemName(item?.item_name);
    }
  }, [item]);

  const handleCancel = (e) => {
    setItemName(''); // clear the field
    handleOnCancel();
  }

  return (
    <div className='collapsible-content option-list-items-form' ref={contentRef} style={{ maxHeight: toggle ? `${contentRef.current.scrollHeight}px` : '0' }}>
      <div className="form-fields-single">
        <div className="field-row">
          <label>Option Item</label>
          <input type="text" value={itemName} onChange={e=>setItemName(e.target.value)} />
          {hasItem &&
            <span className='sm-text'>To Delete Item, empty the field and click Update</span>}
        </div>
        <div className="field-row">
          <button className="custom-btn sm-btn" onClick={e=>handleOnSave(itemName)}>{action}</button>
          {hasItem &&
            <button style={{marginLeft: '5px'}} className="custom-btn sm-btn" onClick={handleCancel}>Cancel</button>}
        </div>
      </div>
    </div>
  )
}