import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply geo-restriction to /admin routes
  if (pathname.startsWith('/admin')) {
    // Get country from various sources
    const country = getCountryFromRequest(request)
    // Allow access if:
    // 1. Country is Australia (AU)
    // 2. Localhost/development (no country detected)
    // 3. Bypass environment variable is set (for testing)
    const isAllowed =
      country === 'AU' ||
      !country || // Allow localhost/development
      process.env.ADMIN_BYPASS_GEO === 'true' // Allow bypass for testing

    if (!isAllowed) {
      // Return 403 Forbidden for non-Australian IPs
      return new NextResponse(
        JSON.stringify({
          error: 'Access Denied',
          message: 'Admin access is restricted to Australia only.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }
  }

  return NextResponse.next()
}

/**
 * Get country code from request headers
 * Checks multiple sources in order of preference:
 * 1. Vercel geolocation header (x-vercel-ip-country)
 * 2. Cloudflare geolocation header (CF-IPCountry)
 * 3. Custom header (x-country-code) for testing
 */
function getCountryFromRequest(request: NextRequest): string | null {
  // Check Vercel geolocation header (if deployed on Vercel)
  const vercelCountry = request.headers.get('x-vercel-ip-country')
  if (vercelCountry) {
    return vercelCountry.toUpperCase()
  }

  // Check Cloudflare geolocation header (if using Cloudflare)
  const cloudflareCountry = request.headers.get('cf-ipcountry')
  if (cloudflareCountry) {
    return cloudflareCountry.toUpperCase()
  }

  // Check custom header for testing (optional)
  const customCountry = request.headers.get('x-country-code')
  if (customCountry) {
    return customCountry.toUpperCase()
  }

  // No country detected (likely localhost or development)
  return null
}

export const config = {
  matcher: ['/admin/:path*'],
}
