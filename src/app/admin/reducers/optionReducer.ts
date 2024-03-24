import * as ACTIONS from '@/constants/options';
import { StateProps } from '@/types/option';



export const optionReducer = (state: StateProps, action: any): StateProps => {
  console.log('optionReducer:', action);
  switch (action.type) {    
    case ACTIONS.UPDATE_OPTION_FIELD:
      return {
        ...state,
        option: {
          ...state.option,
          [action.fieldName]: action.payload,
        }
      } as StateProps;
    case ACTIONS.OPTION_PROCESS_START: 
      // just updating the state of form action to: 'processing'
      return {
        ...state,
        form: {
          ...state.form,
          action: action.payload
        }
      }
    case ACTIONS.CREATE_OPTION_SUCCESS:        
      return {
        ...state,
        form: action.payload.form,
        option: action.payload.option
      } as StateProps;


    case ACTIONS.CREATE_OPTION_VALIDATION_ERROR:
      return {
        ...state,
        form: action.payload
      }      
    
    case ACTIONS.UPDATE_OPTIONS:      
      return {
        ...state,
        option: action.payload
      } as StateProps;
    case ACTIONS.SHOW_OPTION_FORM:
      return {
        ...state,
        formControl: true,
      } as StateProps;
    case ACTIONS.HIDE_OPTION_FORM:
      return {
        ...state,
        formControl: false,
        form: {
          ...state.form,
          action: 'standby',
        },
        option: {
          option_id: 0, 
          option_name: '',
          option_description: '',
        },
      } as StateProps;
    default:
      return state;
  }
}
