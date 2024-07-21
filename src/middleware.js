import { NextResponse } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

  if(token && url.pathname.startsWith('/signin')  || url.pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.redirect(new URL('/signin', request.url))
}
 
export const config = {
  matcher: '/',
}