import { ComponentForm, ComponentForm2, ComponentStatus } from "./common";

// export type JSONOption = (JSONReturn<Option> & {data?: Option})

export type Option = {
  option_id?: number; 
  option_name: string; 
  option_description: string;
}

export type OptionVariant = {
  option_id?: number; 
  option_name: string; 
  option_description: string;
}

export type OptionItem = {
  item_id?: number;
  item_name: string;
  option_id?: number;
}

export type ProductOptions = {
  id?: number;
  option_id: number;
  item_id: number;
  addon_info: string;
  addon_price: number;
  active: boolean;
}

export type StateProps = {
  option: Option;  
  formControl: boolean
  componentStatus: ComponentStatus;
  form: ComponentForm;
}

export type OptionItemState = {
  item_id: number;
  item_name: string;
  option_id: number;  
}

export type OptionAndItems = (Option & { optionitem: OptionItem[] });
export type OptionsAndItems = (Option & { optionitem: OptionItem[] })[];



export type OptionPlusItems = (Option & { optionitem: OptionItem[] });

export type OptionWithItems = OptionPlusItems | OptionPlusItems[];