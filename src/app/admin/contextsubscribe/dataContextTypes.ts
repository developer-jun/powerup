
export type Store = { 
  first: string; 
  last: string 
}; // 

type Action = {
  field: string;
  payload: Partial<Store>
}
export type DataType = {
  type: string;
  payload: any
}
