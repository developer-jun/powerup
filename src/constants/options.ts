
export const SHOW_OPTION_FORM = 'show_option_form';
export const HIDE_OPTION_FORM = 'hide_option_form';

export const CREATE_OPTION = 'create_option'; 
export const CREATE_OPTION_SUCCESS = 'create_option_success';
export const CREATE_OPTION_ERROR = 'create_option_error';

export const OPTION_PROCESS_START = 'option_process_start'; 
export const CREATE_OPTION_VALIDATION_ERROR = 'create_option_validation_error'; 
export const CREATE_OPTION_RESULT = 'create_option_result'; 

export const CREATE_OPTION_END = 'create_option_end'; 

export const UPDATE_OPTION = 'update_option'; 
// was tempted to create one for each form field, but it only create more switch cases on the reducer does more lines of codes.
// Yes it was more descriptive because each form field has it's own switch case, but it ultimately looks the same, repetitive. 
// Which can be simplified by just one switch case then passing the field name along with the value on the dispatch.
// Thus => [action.fieldName]: action.payload
export const UPDATE_OPTION_FIELD = 'update_option_field'; 
export const UPDATE_OPTION_START = 'update_option_start'; 
export const UPDATE_OPTION_VALIDATION_ERROR = 'update_option_validation_error'; 
export const UPDATE_OPTION_RESULT = 'update_option_result'; 
export const UPDATE_OPTION_END = 'update_option_end'; 

// export const UPDATE_OPTION = 'update_option'; // update single property
export const UPDATE_OPTIONS = 'update_options'; // update the whole option object
