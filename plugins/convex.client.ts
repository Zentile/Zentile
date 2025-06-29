import { ConvexHttpClient } from "convex/browser";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const convexUrl = config.public.convexUrl as string
  
  if (!convexUrl) {
    throw new Error('CONVEX_SELF_HOSTED_URL is required')
  }

  // Create Convex HTTP client for server-side rendering and client-side requests
  const convex = new ConvexHttpClient(convexUrl)
  
  return {
    provide: {
      convex
    }
  }
})
