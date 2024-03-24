import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardEdit, Trash2  } from 'lucide-react';
import { useEffect, useState, createRef } from "react";
import { Product } from "@/lib/product"

const Products = (props) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [product, setProduct] = useState({
    id: 0, 
    name: '', 
    description: ''
  });
  let targetRef = createRef();

  useEffect(() => {
    
    
  });

  const scrollToTarget = () => {
    setTimeout(() =>{
        targetRef.scrollIntoView({
            behavior: 'smooth'
        }) 
       }, 500);
  }
  
  const handleEdit = (_product: Product) => {
    props.editCategory(_product);
  };

  const handleDelete = (_product: Product) => {
    console.log(_product);
    const selectedProduct = {
      id: _product.id ? _product.id : 0,
      name: _product.name,
      description: _product.summary
    };
    setProduct(_prod => ({...selectedProduct}));
    setAlertOpen(true);
  };

  const handleConfirmDelete = async () => {    
    try {    
      const res = await fetch(`http://localhost:3000/api/product/${product.id}`, { 
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache",
        body: JSON.stringify({id: product.id})
      });

      // First thing to do is check the result status
      if(!res.ok) throw new Error('Request Error', { cause: {res} })
      props.resetProps({action: 'product_deleted'});
    } catch (error) {
      console.log('ERROR FOUND');
      console.log(error);
    }
    console.log('DELETE PROCESS ENDED')    
  };

  const handleCheckedChange = (e) => {
    
    console.log(e.target.value);
  }

  return (
    <div id="product-list">
      
      Total Products: {props.products?.length}
      {props.products?.length > 0 && (
        <table className="table table-zebra">
          <thead>
            <tr>
              <th><Checkbox /></th>
              <th>Topic</th>
              <th>Description</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {props.products?.map((_product: Product, index) => (
              <tr key={_product.id}>
                <th>
                <Checkbox
                  checked={_product.published}
                  onCheckedChange={handleCheckedChange}
                />
                </th>
                <th>{_product.id}</th>
                <td>{_product.name}</td>
                <td>{_product.summary}</td>
                <td><div className="flex flex-row"><a href="#category-form"><ClipboardEdit className="text-gray-400 hover:text-lime-700 cursor-pointer" onClick={(e) => {props.editCategory(_category)} } /></a><Trash2 className="text-red-600 hover:text-orange-700 cursor-pointer" onClick={(e) => handleDelete(_category)} /></div></td>
            </tr>
            ))}            
          </tbody>
        </table>
      )}      

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              <h3 className="text-lg font-bold text-slate-700">{category.name}</h3>
              <p>{category.description}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}


export default Products;