import { prisma } from "@/context"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, response: NextResponse) {
    //response.headers.set('Content-Type', 'application/json');
    const reqH = request.headers
     console.log("request headers", reqH)
     console.log("request headers", reqH)
    console.log("headers", response.headers)
    if( response.headers)
     {
        response.headers.set('Content-Type', 'application/json')}
    // else { response.headers = {}}
  const products = await  prisma.product.findMany()
  const myResponse = new Response(JSON.stringify(products))
  //myResponse.headers.set('Content-Type', 'application/json')
  ///myResponse.headers.set('Location', 'www.google.com')
 
  // return response.
  return myResponse
}