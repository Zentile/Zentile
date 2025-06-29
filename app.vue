<template>
  <div class="app">
    <header class="header">
      <div class="container">
        <h1>ZenGrid</h1>
      </div>
    </header>
    
    <main class="container">
      <div v-if="pending" class="loading">
        Loading grid items...
      </div>
      
      <div v-else-if="error" class="error">
        Error loading grid items: {{ error }}
      </div>
      
      <div v-else class="grid">
        <a 
          v-for="item in gridItems" 
          :key="item._id"
          :href="item.url || '#'"
          class="grid-item"
          :target="item.url ? '_blank' : '_self'"
        >
          <img 
            v-if="item.imageUrl" 
            :src="item.imageUrl" 
            :alt="item.title"
          />
          <h3>{{ item.title }}</h3>
          <p v-if="item.description">{{ item.description }}</p>
          <span v-if="item.category" class="category">{{ item.category }}</span>
        </a>
      </div>
      
      <!-- Show placeholder if no items -->
      <div v-if="!pending && !error && (!gridItems || gridItems.length === 0)" class="placeholder">
        <h2>Welcome to ZenGrid</h2>
        <p>No grid items found. Add some items using the Convex dashboard or API.</p>
        <p>Dashboard URL: <a :href="dashboardUrl" target="_blank">{{ dashboardUrl }}</a></p>
      </div>
    </main>
  </div>
</template>

<script setup>
const { $convex } = useNuxtApp()
const config = useRuntimeConfig()

// Data
const gridItems = ref([])
const pending = ref(true)
const error = ref(null)

// Computed
const dashboardUrl = computed(() => {
  const convexUrl = config.public.convexUrl
  if (convexUrl && (convexUrl.includes('127.0.0.1') || convexUrl.includes('localhost'))) {
    return 'http://127.0.0.1:6791'
  }
  return 'https://dashboard.your-domain.com'
})

// Methods
const fetchGridItems = async () => {
  try {
    pending.value = true
    error.value = null
    
    // Import the query function
    const { api } = await import('~/convex/_generated/api')
    
    // Fetch grid items from Convex
    const items = await $convex.query(api.gridItems.listGridItems)
    gridItems.value = items
  } catch (err) {
    console.error('Error fetching grid items:', err)
    error.value = err.message || 'Failed to fetch grid items'
    
    // Fallback to sample data for demo purposes
    gridItems.value = [
      {
        _id: '1',
        title: 'Sample Project 1',
        description: 'This is a sample grid item. Configure your Convex backend to add real data.',
        url: 'https://github.com',
        imageUrl: 'https://via.placeholder.com/300x200?text=Sample+1',
        category: 'Project',
        isActive: true
      },
      {
        _id: '2',
        title: 'Sample Project 2',
        description: 'Another sample item. Check the Convex dashboard to manage your data.',
        url: 'https://convex.dev',
        imageUrl: 'https://via.placeholder.com/300x200?text=Sample+2',
        category: 'Tool',
        isActive: true
      }
    ]
  } finally {
    pending.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchGridItems()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.placeholder {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.placeholder h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.placeholder p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.placeholder a {
  color: #3498db;
  text-decoration: none;
}

.placeholder a:hover {
  text-decoration: underline;
}

.category {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
}
</style>
