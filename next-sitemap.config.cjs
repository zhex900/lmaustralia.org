const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://${SITE_URL}`,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/posts/*draft*', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
  },
}
