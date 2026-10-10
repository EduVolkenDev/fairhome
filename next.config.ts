import type { NextConfig } from 'next'

// Keep Turbopack scoped to this project, even if another lockfile exists
// in an ancestor directory of the local workspace.
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    // Avoid the persistent development-cache invalidation loop observed in
    // some Next.js 16.2.x environments. Re-enable after confirming stability.
    turbopackFileSystemCacheForDev: false,
  },
}

export default nextConfig
