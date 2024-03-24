import { NextRequest, NextResponse } from 'next/server';
import { ProductFilter, Pagination, Sorting } from '@/types/product';
import { executeProductFilter } from '@/actions/server/productAction';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const take = searchParams.get('take');
  const skip = searchParams.get('skip');
  const sortBy = searchParams.get('sortBy');
  const order = searchParams.get('order');
  const keyword = searchParams.get('search');
  const category = searchParams.get('category');
  
  const itemsPerPage = take ? parseInt(take) : 5;
  const pagination: Pagination = {
    totals: 0,
    itemsPerPage: itemsPerPage,
    pageCount: 0,
    currentPage: skip ? ((parseInt(skip) + 1) / itemsPerPage ) : 1, // skip = 10, (10 + 1) / 5 =  mean we are currently at page 2 where the page displays 5 items at a time.
  };
  const sorting: Sorting = {
    field: sortBy ? sortBy : 'id',
    direction: order ? order : 'asc',
  }; 
  const filters: ProductFilter  = {
    search: (keyword && keyword.trim() !== '') ? keyword : '',
    category: category ? parseInt(category) : 0,
    publicationType: '',
  };
  const productResults = await executeProductFilter({
    pagination,
    filters,
    sorting
  });

  return NextResponse.json(productResults);
}

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body); // {fullname: 'Test', field2: '', field3: '',......}
  console.log(body.fullname);
  await delay(3000);
  
  return new Response(JSON.stringify({status: 'OK', message: 'User successfully Registered.'}));
}
 /*export async function POST() {
 
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  })
 
  const data = await res.json()
 
  return NextResponse.json(data)
  
}*/