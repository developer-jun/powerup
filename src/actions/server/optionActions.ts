import { Option, OptionWithItems } from "@/types/option";
import { QueryReturnType } from '@/types/common';

export const getQueryOptionReturnTypesOld = (action: string): QueryReturnType<Option> => {
  switch(action) {
    case 'CREATE':
      return {
        data: null,
        status: 'success',
        message: 'Option successfully created',
      }
    default: 
      return {
        data: null,
        status: '',
        message: '',
      }
  }
}

export const formatQueryOptionReturnTypes = <T>(type: string, payload: T, error: string): QueryReturnType<T> => {
  switch(type) {
    case 'QUERY_OPTIONS_SUCCESS':
      return {
        data: payload,
        status: 'success',
        message: 'Options successfully retrieved',
      }
    case 'QUERY_OPTIONS_FAILED':
      return {
        data: payload,
        status: 'error',
        message: 'Options failed to be retrieved',
        details: error
      }
    case 'CREATE_SUCCESS':
      return {
        data: payload,
        status: 'success',
        message: 'Option successfully created',
      }
    case 'CREATE_FAILED':
      return {
        data: payload,
        status: 'error',
        message: 'Option creation failed',
        details: error
      }
    default: 
      return {
        data: null,
        status: '',
        message: '',
      }
  }
}
const result: QueryReturnType<Option> =  {
  data: null,
  status: 'success',
  message: 'Option successfully created',
}