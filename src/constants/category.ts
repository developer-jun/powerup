import { StateTypes } from '@/types/category';
import { MessagePrompt } from '@/types/common';

// export const UPDATE_CATEGORY_PROPSTATE = 'update_category_propstate';
export const UPDATE_CATEGORY = 'update_category';
export const UPDATE_CATEGORY_SLUG = 'update_category_slug';

export const UPDATE_CATEGORY_FIELD = 'update_category_field';
export const UPDATE_CATEGORY_START = 'update_category_start';
export const UPDATE_CATEGORY_VALIDATION_ERROR = 'update_category_validation_error';  
export const UPDATE_CATEGORY_CREATE_RESULT = 'update_category_create_result';

export const UPDATE_CATEGORY_RESET = 'update_category_reset';

export const UPDATE_CATEGORY_LIST = 'update_category_list';

export const UPDATE_FORM_STATUS = 'update_form_status';
export const UPDATE_FORM_STATUSES = 'update_form_statuses';
export const UPDATE_STATE = 'update_state';

export const UPDATE_PARENT_OBJECT = 'update_parent_object';
export const UPDATE_STATE_OBJECT = 'update_state_object';
export const UPDATE_MULTI_STATE_OBJECTS = 'update_multi_state_objects';
export const UPDATE_MULTI_STATE_PARENT_OBJECTS = 'update_multi_state_parent_objects';
export const UPDATE_MESSAGE_PROMPT = 'update_message_prompt';

export const INITIAL_CATEGORY_STATE: StateTypes = {
  category: {
    id: 0,
    name: '',
    slug: '',
    description: '',
    parent: 0
  },
  form: {    
    isProcessing: false,
    slugHasManuallyChanged: false,
    editMode: false,
  },
  alertPrompt: {
    messageType: undefined,
    message: ''
  } as MessagePrompt
};