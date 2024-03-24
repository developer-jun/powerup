import * as ACTIONS from '@/constants/options';
import { OptionItemState } from '@/types/option';



export const optionItemReducer = (state: OptionItemState, action: any): OptionItemState => {
  console.log('optionItemReducer:', action);
  switch (action.type) {    
    case ACTIONS.UPDATE_OPTION_FIELD:
      return {
        ...state,
        option: {
          ...state.option,
          [action.fieldName]: action.payload,
        }
      } as OptionItemState;
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
      } as OptionItemState;    
    
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
