import {UPDATE_USER_FIELD, UPDATE_USER_FIELDS, UPDATE_FORM_FIELD, UPDATE_FORM_FIELDS, 
  LOGIN_PROCESS_START, LOGIN_ATTEMPTS, LOGIN_SUCCESS, VALIDATION_ERROR, LOGIN_FAILURE} from '@/constants/userLogin';

export const initialState = {
  user: {
    email: '',
    password: '',
  },
  form: {
    loginAttempts: 0,
    formAction: '',
    status: '',
    formMessage: []
  }
}

export const reducer = (state = initialState, action: any) => {
  // const { UPDATE_USER_FIELD, UPDATE_USER_FIELDS, UPDATE_FORM_FIELD, UPDATE_FORM_FIELDS } = ACTIONS;
  const { payload, type } = action;
  console.log(type, payload);
  switch (type) {
    case UPDATE_USER_FIELD:
      return {
        ...state,
        user: {
          ...state.user,
          [action.fieldName]: payload,
        }        
      };
    case UPDATE_USER_FIELDS:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        }
      };
    case UPDATE_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.fieldName]: payload
        }
      };
    case UPDATE_FORM_FIELDS:
      return {
        ...state,
        form: {
          ...state.form,
          ...payload
        }
      };      
    case LOGIN_PROCESS_START:
      return {
        ...state,
        form: {
          ...state.form,
          formAction: payload.formAction,
          status: payload.status
        }
      }
    case VALIDATION_ERROR:
      return {
        ...state,
        form: {
          ...state.form,
          loginAttempts: state.form.loginAttempts + 1,
          formMessage: payload.errors
        }
      }    
    case LOGIN_FAILURE:
      return {
        ...state,
        form: {
          ...state.form,
          loginAttempts: payload.loginAttempts,
          formMessage: payload.formMessage,
          formAction: payload.formAction,
          status: '',
        }
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          loginAttempts: 0,
          formAction: '',
          status: 'PROCESSING', // keep the status processing to let the use know it's now redirecting
          formMessage: []
        }
      }
    default:
      return state;
  }
}



type UpdateFormFieldsPayload = {
  loginAttempts: number;
  formAction: string;
  formMessage: string;
  status: string;
};
type UpdateUserFieldPayload = {
  fieldName: string;
  value: any;
};

type Action<T extends string, P> = {
  type: T;
  payload: P;
};

type DispatchAction = 
  | Action<'UPDATE_FORM_FIELDS', UpdateFormFieldsPayload>
  | Action<'UPDATE_USER_FIELD', UpdateUserFieldPayload>;

const dispatch2 = (action: DispatchAction) => {
  // Dispatch logic here
};