import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createConvexVue } from "@convex-vue/core";

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const convex = createConvexVue({
    convexUrl: runtimeConfig.public.CONVEX_URL as string,
    // auth: {
    //   isAuthenticated: ref(!!auth.isSignedIn.value),
    //   isLoading: ref(!auth.isLoaded),
    //   getToken: async () => {
    //     try {
    //       const response = await auth.getToken.value({
    //         template: "convex",
    //         skipCache: true,
    //       });
    //       return response;
    //     } catch (error) {
    //       return null;
    //     }  
    //   }
    // },
    // installNavigationGuard: true,
    // needsAuth: to => to.meta.needsAuth
    // redirectTo: () => ({
    //   name: 'Login'
    // })
  })

  nuxtApp.vueApp.use(convex)
})