export default defineEventHandler((event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'zentile nuxt app healthy'
  }
});
