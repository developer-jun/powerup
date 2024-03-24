export const ACTIONS = {
  UPDATE_PRODUCT: 'update_product',
  UPDATE_PRODUCT_FIELD: 'update_product_field',
  UPDATE_PRODUCT_SUCCESS: 'update_product_success',
  UPDATE_PRODUCT_FAILURE: 'update_product_failure',  

  UPDATE_FORM_STATUS: 'update_form_status',
  UPDATE_FORM_STATUSES: 'update_form_statuses',
  RESET_STATE: 'reset_state'
}


export const initialState = {
  // product attributes
  product: {
    productName: '',
    slug: '',
    summary: '',
    prodImage: '',
    price: 0,
    sku: '',
    description: '',
    stock: '',
    publish: false
  },

  // form misc.
  form: {    
    isProcessing: false,
    message: '',
    messageType: '',
    slugHasChanged: false 
  }
};

export const reducer = (state, action) => {
  console.log('state action: ', action?.type);
  console.log("payload: ", action.payload);
  // reducer must be a pure function
  // we are not modifying the state here, that's against pure function principle
  // rather, we are creating a new object and return it.
  // the returned object will now be the new state value
  // this is the main purpose of reducer, it's a function with some logic to create a new state object which when returned will replace the new state
  // this is where spread operator is very useful, why is that? simply because we still need the original state value or properties, we only update what needs to be updated.
  switch(action.type) {
    case ACTIONS.UPDATE_PRODUCT: 
      return {
        ...state,
        product: {
          ...state.product,
          ...action.payload, 
        },
      };
    case ACTIONS.UPDATE_PRODUCT_FIELD: 
      return {
        ...state,
        product: {
          ...state.product,
          [action.fieldName]: action.payload,
        },
      };
    case ACTIONS.UPDATE_FORM_STATUS: 
      return {
        ...state,
        form: {
          ...state.form,
          [action.fieldName]: action.payload, 
        },
      };
    case ACTIONS.UPDATE_FORM_STATUSES: 
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload, 
        },
      };    
    case ACTIONS.RESET_STATE: // reset state values will fall into this case
      return {
        ...state,
        ...action.payload // ... here means, match all the fields of object action.payload to the previous ...(object) which in our case 'state'
      };
    default: // init
      return state;
  }
}