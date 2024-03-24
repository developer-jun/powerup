import { isEmpty } from '@/utils/helpers';
import { ComponentStatus } from '@/types/common';
import { StateProps, Option, OptionPlusItems, OptionAndItems } from '@/types/option';
import { processCreateOption }  from '@/services/option';
import { OPTION_PROCESS_START, UPDATE_OPTION_START, CREATE_OPTION, CREATE_OPTION_SUCCESS, CREATE_OPTION_ERROR, CREATE_OPTION_VALIDATION_ERROR, CREATE_OPTION_RESULT, CREATE_OPTION_END, UPDATE_OPTION_END } from '@/constants/options';



export const addItemsToOption = (option: Option): OptionPlusItems => ({...option, optionitem: [] });

// currently unused, the form is too little, it'll will be over in as little of milliseconds
// delete if nothing will change on the form
export const optionModificationStart = (actionType: string) => ({
  type: actionType,
  payload: {
    isProcessing: true,
    action: 'processing'
  }
})

export const optionModificationEnd = (actionType: string) => ({
  type: actionType,
  payload: {
    isProcessing: false,
    action: 'standby'
  }
})

/*
export const triggerOptionListRefetch = (): OptionPlusItems[] => {
  setTimeout(() => {
    return {

    }
  }, 1000);
}
*/

const optionValidationFailed = (message: string) => ({
  type: CREATE_OPTION_VALIDATION_ERROR, 
  payload: {
    message: message,
    messageType: 'error',
    isProcessing: false,
    action: 'standby',
  }
})

type OptionProps = {
  dispatch: ({}) => void,
  optionData: Option
}
export const updateOption = async ({dispatch, optionData}: OptionProps) => {
  // dispatch(optionModificationStart(CREATE_OPTION_START));
  // identify the action
  const action = optionData.option_id && optionData.option_id > 0 ? 'CREATE' : 'UPDATE';
  dispatch({
    type: OPTION_PROCESS_START,
    payload: {
      action: 'processing'
    }
  });

  if(optionData.option_name === ''){
    //dispatch(optionValidationFailed('Option name is required'));
    dispatch({
      type: CREATE_OPTION_VALIDATION_ERROR, 
      payload: {
        message: 'Option name is required',
        messageType: 'error',
        action: 'complete',
      }
    });
    return false;
  } else {
    console.log('optionData: ', optionData);
    const createResult = await processCreateOption(optionData);
    console.log('createResult:', createResult);
    if(createResult.status === 'success') {
      
      dispatch({
        type: CREATE_OPTION_SUCCESS, 
        payload: {
          option: {option_id: 0, option_name: '', option_description: ''} as Option, 
          form: {
            action: 'complete',
            message: 'Option successfully ' + (action === 'CREATE' ? 'created.' : 'updated.'),
            messageType: createResult.status
          }
        }
      });

      return createResult.data; // return the actual data
    } else {
      dispatch({
        type: CREATE_OPTION_ERROR, 
        payload: {
          action: 'complete',
          message: createResult.message + '(' + createResult.details + ')',
          messageType: createResult.status
        }
      });
      return false;
    }   

    //if(createResult.status === 'OK') return true; // don't let it go to the createOptionEnd just yet. We still need to integrate the new option to optionList props.
  }
  
  // dispatch(optionModificationEnd(CREATE_OPTION_END));
  return false
}


export const updateOption2 = async ({dispatch, optionData}: OptionProps) => {
  dispatch(optionModificationStart(
    optionData.option_id 
      ? CREATE_OPTION_RESULT 
      : UPDATE_OPTION_START
    ));

  // console.log('Option ',optionData, ' will be saved into the database');
  if(optionData.option_name === '')
    dispatch(optionValidationFailed('Option name is required'));
  else {
    console.log('optionData: ', optionData);
    
    const processResult = await processCreateOption(optionData);
    
    dispatch({
      type: optionData.option_id ? CREATE_OPTION_RESULT : UPDATE_OPTION_START, 
      payload: {
        message: processResult.message,
        messageType: processResult.status === 'NOK' ? 'error' : 'success',
        action: 'complete',
      }
    });

    if(processResult.status === 'OK') return; // don't let it go to the createOptionEnd just yet. We still need to integrate the new option to optionList props.
  }

  dispatch(optionModificationEnd(
    optionData.option_id 
      ? CREATE_OPTION_END 
      : UPDATE_OPTION_END
    )); 
    
  {/*
    option_id: option.option_id, 
    option_name: option.option_name, 
    option_description: option.option_description
*/}
}

export const updateOptionTitle = async (optionData: Option) => {
  

  // console.log('Option ',optionData, ' will be saved into the database');
  if(optionData.option_name === '')
    return {
      status: 'NOK',
      message: 'Option name is required'
    }
  else {
    const processResult = await processCreateOption(optionData);
    
    return processResult;
    /*dispatch({
      type: optionData.option_id ? CREATE_OPTION_RESULT : UPDATE_OPTION_START, 
      payload: {
        message: processResult.message,
        messageType: processResult.status === 'NOK' ? 'error' : 'success',
        isProcessing: false,
        action: 'complete',
      }
    });
    */
    // if(processResult.status === 'OK') return; // don't let it go to the createOptionEnd just yet. We still need to integrate the new option to optionList props.
  }
}

type DefaultOptionStateProps = {  
  option: OptionAndItems,
  formControl?: boolean,
}
export const getDefaultOptionState = ({option, formControl}: DefaultOptionStateProps): StateProps => {
  return {
      option: !isEmpty(option) ? option as Option : {
        option_id: 0, 
        option_name: '',
        option_description: '',
      },
      componentStatus: 'init',
      formControl: (formControl) ? true : false, // show / hide the option main form      
      form: {
        action: 'standby', // complete, standby, processing
        message: '',
        messageType: undefined,
      }
  }
}