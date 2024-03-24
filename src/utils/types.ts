

/*export type JSONData = {
  status: string,
  message: string,
}*/
export type JSONData<T> = {
  status: string,
  message: string,
  data?: Array<T>
}