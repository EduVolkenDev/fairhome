import { createClient } from '@nhost/nhost-js'

const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN
const region = process.env.NEXT_PUBLIC_NHOST_REGION

export const nhost = subdomain && region
  ? createClient({ subdomain, region })
  : null

export const nhostConfig = {
  configured: Boolean(nhost),
  subdomain,
  region,
}
