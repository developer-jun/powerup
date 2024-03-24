import React from 'react'
import useOptionContext from '../../hooks/useOptionContext';
import OptionItems from './optionItems';
import { isEmpty } from '@/utils/helpers';
const OptionLists = () => {
  const { items, setOption } = useOptionContext();
  console.log('optionLists:', items);
  return (
    <>
      <div className='option-lists'>
        <h2>Options</h2>
        <div className='options'>
          { items && items.map((option, index) => {
              return (
                <div className='option-item' key={ option.option_id }>
                  <a title="Edit" href="#" onClick={e=>setOption(option)}>{`${index+1}. ${option.option_name}`}</a>
                  {/*!isEmpty(option.optionitem) && */
                    <OptionItems optionId={option.option_id} items={option.optionitem} />
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}


export default OptionLists;