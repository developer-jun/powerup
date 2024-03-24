import { Product, StockStatuses } from "@/types/product";
import { OptionAndItemsQuery } from '@/types/option';
import { QueryReturnType } from "@/types/common";
import { Category, CategoryHierarchy } from "@/types/category";

const safeBooleanData = (data: [unknown]): data is [boolean] => {
  return typeof data === "boolean" ? data : false;
}

const safeENUMData = (data: keyof typeof StockStatuses): StockStatuses => {
  const stockStatus = StockStatuses[data];

  return (typeof stockStatus === 'undefined') ? StockStatuses.INSTOCK : stockStatus;
}

// 191 is Prisma's default for any string data type
const safeData = (data: string, maxLength: number = 191) => {
  return (data.length > maxLength) ? data.substring(0, maxLength) : data;
};

export const generateTypeSafeProductData = (data: any): Product => {
  return {
    name: safeData(data.name),
    slug: safeData(data.slug),
    sku: safeData(data.sku),
    summary: safeData(data.summary, 250),
    description: safeData(data.description, 1000),
    imageUrl: safeData(data.imageUrl),
    thumbUrl: '',
    price: parseFloat(data.price),
    inStock: safeENUMData(data.inStock),
    // inStock: safeData<keyof typeof StockStatuses>(data.inStock) as StockStatuses || StockStatuses.INSTOCK,
    published: safeBooleanData(data.published),
  }
}

type GetAPIOptionsProps<T> = {
  data: T;
  method?: string;
  cache?: RequestCache;  
}

export const getAPIOptions = <T>({data, method = 'POST', cache = 'no-cache'}: GetAPIOptionsProps<T>): RequestInit => {
  return {
    method: method,
    mode: "cors",
    cache: cache, // *default, no-cache, reload, force-cache, only-if-cached
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  }
}

export const isObjectEmpty = (objectName: object): boolean => {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
};

export const isObjectNullOrEmpty = (obj: object): boolean => {
  return obj === null || Object.keys(obj).length === 0;
}

export const isEmpty = (obj: Record<string, any>): boolean =>{
  return Object.keys(obj).length === 0;
}

export const getDefaultQueryStructure = <T>(dataObj: T, defaultMessage: string): QueryReturnType<T> => {
  return {
    status: 'success',
    message: defaultMessage,
    data: dataObj ? dataObj : null
  }
}

export const isUrl = (url = '') => {
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
};




// NOT CURRENTLY USED. 
export const getQueryDataStructure = <T>(arg: T): T => {
  return {
    data: arg, // as T,
    message: '',
    type: true
  } as OptionAndItemsQuery;
};