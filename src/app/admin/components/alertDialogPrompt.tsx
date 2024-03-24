import React, { useEffect, useRef, useState } from 'react'
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
import Loader from '@/components/blocks/loader';
import { Category } from '@/types/category';
import useDelete from '@/hooks/useDelete';
import useToggle from '@/hooks/usePromptToggle';

const categoryDeleteUrl = 'http://localhost:3000/api/category/';
type AlertDialogPromptTypes = {
  selectedCategory: Category;
  refreshCategories: () => void;
  checkSelectionConflict: () => void;
}
export default function AlertDialogPrompt({selectedCategory, refreshCategories, checkSelectionConflict}: AlertDialogPromptTypes) {
  const { toggle, setToggle } = useToggle(selectedCategory);
  const { result, loading, execute, resetStates } = useDelete(); 
  const closeCancelButtonRef = useRef('Cancel');

  if(result?.messageType !== undefined) {
    closeCancelButtonRef.current = 'Close';
  } else {
    closeCancelButtonRef.current = 'Cancel';
  }
  
  useEffect(() => {    
    if (result?.messageType === 'success') {
      refreshCategories(); // force refresh to removed delete category on the list

      const timer = setTimeout(() => {
        setToggle(false); // close the dialog        
        // resetStates(); // 
        // closeCancelButtonRef.current = 'Cancel'; // reset back to default
      }, 3000);
  
      return () => clearTimeout(timer); 
    }
  }, [result]);

  const handleConfirmDelete = async () => {   
    
    console.log('DELETE PROCESS STARTED');
    execute(categoryDeleteUrl + selectedCategory.id);

    // TODO:
    // NOW what? try and integrate deleteResult, loading, and error
    console.log('DELETE PROCESS ENDED');
    checkSelectionConflict(); // parent 
  };

  const handleCancel = () => {
    setToggle(false);
    
    // TODO:
    // just in case the user Cancel when delete is on going, do something about it.
    resetStates();   
  };

  if(!selectedCategory) return;

  return (
    <>
      <AlertDialog open={toggle}> {/* onOpenChange={e=>setAlertOpen(false)} */}
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>          
          { result.messageType !== undefined
            ? <>
                <span className={"alert alert-" + result.messageType} role="alert">{result.message}</span>
              </>
            : 
              <AlertDialogHeader>            
                <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
                <AlertDialogDescription className='fw-normal'>                  
                  <span className="row">
                    <span className='col-4'>Category Name:</span>
                    <span className='col'>{selectedCategory.name}</span>
                  </span>
                  <span className="row">
                    <span className='col-4'>Description:</span>
                    <span className='col'>{selectedCategory.description}</span>
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader> }            
          <AlertDialogFooter>            
            <AlertDialogCancel onClick={handleCancel}>{closeCancelButtonRef.current}</AlertDialogCancel>
            { loading ? <Loader /> : (result && result.messageType === undefined) ? <AlertDialogAction onClick={handleConfirmDelete}>Yes</AlertDialogAction> : null }
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
