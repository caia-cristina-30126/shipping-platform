export { auth as middleware } from "@/auth"

// middleware.js
export const config = {
    
    matcher: ['/dashboard/(.*)',"/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
  };