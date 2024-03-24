import { memo } from 'react';
import { ClipboardEdit, Trash2  } from 'lucide-react';
import { ProductWithSelection} from '@/types/product';
import "./product-item.scss";



type ProductItemProps = {
  product: ProductWithSelection,
  handleOnCheck(id: number): void,
  //handleOnEdit(id: number): void,
  //handleOnDelete(id: number): void,
}

export const ProductItem = memo(function({product, handleOnCheck}: ProductItemProps) {
  const { id, name, price, summary, isSelected} = product;
  console.log('Item:',id, isSelected);
  return (    
    <tr className='product-item' key={id}>
        <th>      
          <input type="checkbox" onChange={(e) => { handleOnCheck(id)}} checked={isSelected} className="checkbox" />
        </th>        
        <td>{name}</td>
        <th>$ {price}</th>
        <td>{summary}</td>
        <td>
          <div className="flex flex-row"></div></td>
    </tr>
  )
});

// {/*<a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {handleOnEdit(id)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleOnDelete(id)} />*/}
/*
export const ProductItem = memo(Item, (previousProps, nextProps) => {
  return previousProps.product === nextProps.product;
});*/

/*
const arePropsEqual = (prevProps: ProductItemProps, nextProps: ProductItemProps) => {
  // Only re-render if the isSelected prop has changed
  return prevProps.isSelected === nextProps.isSelected;
};

export const ProductItem = memo(Item, arePropsEqual);
*/

/*
export const ProductItem = memo(Item, (previousProps, nextProps) => {
  const prevProduct = previousProps.product;
  const nextProduct = nextProps.product;

  return (
    prevProduct.id === nextProduct.id &&
    prevProduct.sku === nextProduct.sku &&
    prevProduct.name === nextProduct.name &&
    prevProduct.summary === nextProduct.summary &&
    prevProduct.price === nextProduct.price &&
    prevProduct.isSelected === nextProduct.isSelected
  );
});
*/