import { memo } from 'react';
import { ClipboardEdit, Trash2  } from 'lucide-react';
import { ProductWithSelection} from '@/types/product';
import "./product-item.scss";

type ProductItemProps = {
  product: ProductWithSelection,
  handleOnCheck(id: number): void, // definition located 1 level up
  handleOnEdit(id: number): void, // definition located 1 level up
  handleOnDelete(id: number): void, // definition located 2 levels up
}
export const ProductItem = memo(({product, handleOnCheck, handleOnEdit, handleOnDelete}: ProductItemProps) => {
  const { id, name, price, summary, isSelected, category} = product;
  const productId = id ? id : 0;
  
  return (    
    <tr className='product-item' key={productId}>
        <th>      
          <input type="checkbox" onChange={(e) => {handleOnCheck(productId)}} checked={isSelected} className="checkbox" />
        </th>        
        <td>{name}</td>
        <td>{category}</td>
        <th>$ {price}</th>
        <td>{summary}</td>
        <td>
          <div className="flex flex-row">
            <ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {handleOnEdit(productId)} } />
            <Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleOnDelete(productId)} />  
          </div>
        </td>
    </tr>
  )
});
