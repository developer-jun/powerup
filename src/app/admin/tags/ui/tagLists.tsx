import React, { useEffect, useState } from 'react'
import { isEmpty } from '@/utils/helpers';
import useTags from '../../hooks/useTags';

const TagLists = ({refreshList}: {refreshList: number}) => {
  const { data, message, loading, refreshList: refreshTags } = useTags({});
  const [ tag, setTag ] = useState({});

  useEffect(() => {
    if(refreshList > 0) {
      refreshTags();
    }
  }, [refreshList]);

  console.log('tags:', data);
  return (
    <>
      <div className='tag-lists'>
        <h2>Tags</h2>
        <div className='tags'>
          { data && data.map((tag, index) => {
              return (
                <div className='tag-item' key={ tag.tag_id }>
                  <a title="Edit" href="#" onClick={e=>setTag(tag)}>{`${index+1}. ${tag.name}`}</a>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}


export default TagLists;