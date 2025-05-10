 export { auth as middleware } from "@/auth"

// middleware.js
export const config = {
    matcher: ['/dashboard/(.*)', "/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
  }

//   // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest, response: NextResponse) {
//     console.log("Route interceprted by middleware: ", request.url)
    
//     return false;
//     // const jwt = getJwet()
//     // // if (!jaws) {
//     //     AsyncCallbackSet.authorize()
//     // }
//     // return NextResponse.redirect(new URL('/home', request.url))
//   }

