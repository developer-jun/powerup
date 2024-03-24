import { NextResponse } from 'next/server'

// GET - should only retrieve data
export async function GET(request: Request) {}
 
// similar to get but no response body
export async function HEAD(request: Request) {}

// POST - submits an entity to the specified resource, often causing a change in state or side effects on the server
export async function POST(request: Request) {}
 
// Update or replaces all current representations of the target resource with the request payload.
export async function PUT(request: Request) {}

// delete
export async function DELETE(request: Request) {}
 
export async function PATCH(request: Request) {}
 
// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}