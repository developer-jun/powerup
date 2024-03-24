export const initialState: StateInit = {
  products: [],  
};

export const reducer = (state: StateInit, action: any) => {
  switch(action.type) {
    case ACTIONS.UPDATE_PRODUCT_SELECTION:
      return {
        ...state,
        products: state.products.map(
          product => (product.id === action.payload) 
            ? { ...product, isSelected: !product.isSelected }
            : product          
        )
      };
    case ACTIONS.SEARCH:
      return {
        ...state,
        products: state.products.filter(
          product => (
            product.name.toLowerCase().includes(action.payload.toLowerCase())
            || (product.summary.toLowerCase().includes(action.payload.toLowerCase()))
          )          
        )
      }
    case ACTIONS.UPDATE_STATE:      
      return {
        ...state,
        ...action.payload
      };  
   
    default:{
      console.log('STATE set to ' + state);
      return state;
    }
  }
}