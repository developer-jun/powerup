import {JSONData, Category, StateTypes} from "@/types/category";
import * as ACTIONS from "@/constants/category";
import { doUpdateCategory } from "@/services/categories";
import { validateCategory } from "@/app/admin/utils/categoryHelpers";

type FormProcessProps = {
  dispatch({}): void,
  data?: any
}
const startFormProcess = () => ({
  type: ACTIONS.UPDATE_CATEGORY_START    
});

export const validationProcessError = (data: string[]) => ({
  type: ACTIONS.UPDATE_CATEGORY_VALIDATION_ERROR,
  payload: {
    form: {
      isProcessing: false,
      message: data.join('<br />'),
      messageType: 'error',
    }
  }
});

export const resetToInitialState = () => ({
  type: ACTIONS.UPDATE_STATE, 
  payload: ACTIONS.INITIAL_CATEGORY_STATE
});

const resetCategoryState = () => ({
  type: ACTIONS.UPDATE_CATEGORY_RESET  
});

const successfullyCreated = (message: string) => ({
  type: ACTIONS.UPDATE_CATEGORY_CREATE_SUCCESS,
  payload: { 
    form: {
      message: message,
      messageType: 'success',
      isProcessing: false,
    }
  }
});

const failedCreate = (message: string) => ({
  type: ACTIONS.UPDATE_CATEGORY_CREATE_SUCCESS,
  payload: { 
    form: {
      message: message,
      messageType: 'error',
      isProcessing: false,
    }
  }
});

type UpdateCategoryProps = {
  dispatch({}): void,
  categoryData: Category,
  resetProps(): void,
}
export const updateCategory = async ({dispatch, categoryData, resetProps}: UpdateCategoryProps )  => {
  dispatch(startFormProcess());
  
  // DO MANUAL VALIDATION.
  const formError = validateCategory( {name: categoryData.name, slug: categoryData.slug});
  if(formError.length) 
    return dispatch(validationProcessError(formError));
  
  const result = await doUpdateCategory(categoryData);  
  if(result.status === 'NOK') 
    return dispatch(failedCreate(result.message));
  
  // update the form to display the message
  dispatch(successfullyCreated(result.message));

  // give the success message 3 seconds
  setTimeout(() => {    
    dispatch(resetCategoryState());    
    resetProps(); // callback to the parent of NewCategoryForm component
  }, 3000);  
}

export const fetchCategoryAction = async () => {
  const options = {  
    next: { revalidate: 0 }
  }

  try {  
    const jsonData: JSONData = await fetch('/api/category', options)
      .then(response => response.json());
    
    return jsonData;
  } catch (err) {
    console.log(err);
    const errorResponse: JSONData = {status: 'NOK', message: 'An unexpected SERVER error occurred. Please try again later.'};
    return errorResponse;
  }
}

type OnloadStateProps = {
  propState: any, 
  parentCategory: string, 
}
export const setPropOnloadState = ({propState, parentCategory}: OnloadStateProps) => ({
  type: ACTIONS.UPDATE_STATE, 
  payload: { 
    category: {
      ...propState, 
      parent: parentCategory,              
    },
    componentStatus: 'loaded',
    form: { 
      slugHasManuallyChanged: true,
      editMode: true,
    }
  }
});

type UpdateCategorySlugProps = {
  slug: string,
  slugHasManuallyChanged: boolean
}
export const updateCategorySlug = ({slug, slugHasManuallyChanged}: UpdateCategorySlugProps ) => ({
  type: ACTIONS.UPDATE_CATEGORY_SLUG,
  payload: {
    slug,
    slugHasManuallyChanged
  }
});

export const updateCategoryList = (categoryList: Category[]) => ({
  type: ACTIONS.UPDATE_CATEGORY_LIST, 
  fieldName: 'categories',
  payload: categoryList
})

type UpdateCategoryFieldProps = {
  fieldName: string,
  value: any
}
export const updateCategoryField = ({fieldName, value}: UpdateCategoryFieldProps) => ({
  type: ACTIONS.UPDATE_CATEGORY_FIELD, 
  fieldName: fieldName, 
  payload: value
})


// TODO: set for delete
export const getEmptyCategoryObject = () => ({
  id: 0,
  parent: 'none',
  name: '',
  slug: '',
  description: ''
});

export const getSlugOfCategory = (parentId: number, categories: Category[]): string => {
  if(!parentId) return 'none';
  
  const category = categories.find(category => category.id === parentId);
  return category ? category.slug : '';
};

export const convertSlugToID = (slug: string, categories: Category[]): number => {
  if(slug === '' || slug === 'none') return 0;
  
  const category = categories.find(category => category.slug === slug);

  return (category && category.id !== undefined) ? category.id : 0;
};