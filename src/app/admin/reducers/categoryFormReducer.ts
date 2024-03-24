import { Category, StateTypes } from '@/types/category';
import * as ACTIONS from '@/constants/category';

// TODO: Clean up and removed unused case and Actions.
//    - Consolidate the actions.payload to be fieldname and data
export const reducer = (state : StateTypes, action : any) => {
  console.log('state action: ', action?.type);
  console.log("payload: ", action.payload);
  switch(action.type) {
    // special case in updating a category field, we are forced to update two, the slug and the flag that slug has been updated manually
    case ACTIONS.UPDATE_CATEGORY_FIELD:
    case ACTIONS.UPDATE_CATEGORY_START: 
    case ACTIONS.UPDATE_CATEGORY_SLUG:
    case ACTIONS.UPDATE_MULTI_STATE_OBJECTS: {
      let newState = { ...state };
      if(Array.isArray(action.payload)) {
        action.payload.forEach((item) => {
          if (item.parent) {
            // Update a single field from a known parent object
            // state = { ...state, [parent]: { ...state.[parent], [fieldName]: data }},
            newState = {
              ...newState,
              [item.parent as keyof StateTypes]: { // having a parent means we are updating a field of that parent.
                ...newState[item.parent as keyof StateTypes],
                [item.field.fieldName]: item.field.data
              }
            }
          } else {
            // Updates one object
            // state = { ...state, [fieldName]: data }
            newState = {
              ...newState,
              [item.fieldName as keyof StateTypes]: item.data
            }
          }          
        });
      }
      return newState;
    }
    // these are topmost object setter, exclusively for: category, form, and alertPrompt
    case ACTIONS.UPDATE_PARENT_OBJECT: // used when user selects a category to edit        
    case ACTIONS.UPDATE_MULTI_STATE_PARENT_OBJECTS: {
      let newState = { ...state };
      if(Array.isArray(action.payload)) {
        action.payload.forEach((item) => {
          newState = {
            ...newState,
            [item.fieldName as keyof StateTypes]: item.data
          }
        });
      }
      return newState;
    }
    case ACTIONS.UPDATE_CATEGORY_VALIDATION_ERROR: 
    case ACTIONS.UPDATE_CATEGORY_CREATE_RESULT: 
      // light
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload.form,
        },
        alertPrompt: action.payload.alertPrompt        
      };      
    case ACTIONS.UPDATE_FORM_STATUS: 
      // light
      return {
        ...state,
        form: {
          ...state.form,
          [action.fieldName]: action.payload, 
        },
      };
    // In used
    case ACTIONS.UPDATE_STATE: 
      return {
        ...state,
        ...action.payload // ... here means, match all the fields of object action.payload to the previous ...(object) which in our case 'state'
      };
    case ACTIONS.UPDATE_CATEGORY_RESET:
      return {
        ...state,
        category: {
          id: 0,
          parent: 'none',
          name: '',
          slug: '',
          description: ''
        },
        form: {          
          slugHasManuallyChanged: false,
          isProcessing: false,
        },
        alertPrompt: {
          message: '',
          messageType: undefined,
        }
      };
  }
  throw Error('Unknown action: ' + action.type);
}