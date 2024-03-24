import prisma from './db';
import { Option, OptionAndItems } from "@/types/option"; //OptionAndItemsQuery
import { QueryReturnType, QueryReturn } from '@/types/common';

export async function getOptions(): Promise<QueryReturn<OptionAndItems[]>> {
  try{
    return {
      data: await prisma.option.findMany({
        include: {
          optionitem: true
        }
      }) as OptionAndItems[],
      status: 'success',
    }
  } catch (error: any) {
    return {
      status: 'error',
      message: 'Options failed to be retrieved',
      details: error.message
    }   
  }
}

export const create = async (option_data: Option): Promise<QueryReturn<Option>> => {
  console.log('create:', option_data);
  try {
    const newOption = await prisma.option.create({data: option_data});
    return {
      data: newOption,
      status: 'success',
    }    
  } catch (error: any) {
    console.log('QUERY ERROR');
    console.error('Option creation error:', error);
    return {
      status: 'error',
      message: 'Option creation failed',
      details: String(error.message)
    }
  }
}

export const update = async (option_data: Option): Promise<QueryReturn<Option>> => {
  try {
    return {
      status: 'success',
      data: await prisma.option.update({
        where: { option_id: option_data.option_id },
        data: option_data
      })      
    }    
  } catch (error) {
    console.log('QUERY ERROR');
    console.log(String(error));
    return {
      status: 'error',
      message: 'Option update failed',
      details: String(error)
    }
  }
}


type OptionAndItemsQuery = {
  data: Option | null;
  message: string;
  type: boolean; // 0 = error, 1 = success
}
export async function getOption(option_id: number): Promise<QueryReturn<OptionAndItems>> {
  try{
    return {
      status: 'success',
      data: await prisma.option.findFirst({
        where: { option_id},
        include: {
          optionitem: true
        }
      })
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Retrieval failed.',
      details: String(error)
    }
  }
  //return results as QueryReturn<OptionAndItems>;
}

