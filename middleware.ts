import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isAdmin = req.auth?.user?.role === "admin"

  // Security: Block direct IP access, enforce domain
  const host = req.headers.get("host")
  const allowedHost = "app.reclaimchennai.city"
  const isDev = process.env.NODE_ENV === "development"

  if (!isDev && host && !host.includes(allowedHost) && !host.includes("localhost")) {
     // Optional: Redirect to canonical domain or 403
     // return NextResponse.redirect(`https://${allowedHost}${req.nextUrl.pathname}`)
     // For now, let's just allow it if it matches Caddy's expected behavior, 
     // but if the user wants strict blocking:
     if (!host.includes(allowedHost)) {
       // Check if accessing via IP
        const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host);
        if (isIp) {
            return new NextResponse("Direct IP access not allowed", { status: 403 });
        }
     }
  }

  if (isOnAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin", "/admin/:path*", "/profile", "/profile/:path*", "/redeem"],
}
