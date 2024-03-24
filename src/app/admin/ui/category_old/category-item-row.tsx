"use client"

import { ClipboardEdit, Trash2  } from 'lucide-react';

const CategoryItemRow = ({data: {id, title, description}}) => {

  const handleEditBtnClick = (e) => {
    e.preventDefault();
    // we are not really editing the  category here, we simply calls a parent function passing the selected id of the category
    // the parent component has the function that will retrieve the data using the passed id then populate the form with the data
    newSelectedValue(id);
  }

  // const topics = await getTopics();
  console.log(description);
  return (
    <tr key={id}>
      <th>{id}</th>
      <td>{title}</td>
      <td>{description}</td>
      <td><div className="flex flex-row"><a href="#"><ClipboardEdit onClick={handleEditBtnClick} /></a><a href="#"><Trash2 /></a></div></td>
    </tr>  
  )
}


export default CategoryItemRow;