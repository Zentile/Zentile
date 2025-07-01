<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">ZenTile - Server-Side Convex Demo</h1>
    
    <!-- Grid Items Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Grid Items</h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2">Loading grid items...</span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      
      <!-- Grid Items Display -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="item in items" 
          :key="item._id"
          class="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          <h3 class="font-semibold text-lg mb-2">{{ item.title }}</h3>
          <p v-if="item.description" class="text-gray-600 mb-2">{{ item.description }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span v-if="item.category" class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {{ item.category }}
            </span>
            <span>Order: {{ item.order || 0 }}</span>
          </div>
          <a 
            v-if="item.url" 
            :href="item.url" 
            target="_blank"
            class="inline-block mt-2 text-blue-500 hover:text-blue-700"
          >
            View Link →
          </a>
        </div>
      </div>
      
      <pre wrap>{{ gridItems }}</pre>

      <!-- Empty State -->
      <!-- <div v-if="!loading && !error && gridItems.value.length === 0" 
           class="text-center py-8 text-gray-500">
        No grid items found. Create some using the form below!
      </div> -->
    </div>
    
    <!-- Create New Item Form -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Create New Grid Item</h2>
      
      <form @submit.prevent="handleCreateItem" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input 
            v-model="newItem.title"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter item title"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="newItem.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter item description"
            rows="3"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input 
              v-model="newItem.category"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., tools, games, productivity"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input 
              v-model.number="newItem.order"
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input 
            v-model="newItem.url"
            type="url" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input 
            v-model="newItem.imageUrl"
            type="url" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div class="flex items-center">
          <input 
            v-model="newItem.isActive"
            type="checkbox" 
            id="isActive"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="isActive" class="ml-2 block text-sm text-gray-700">
            Active (visible in grid)
          </label>
        </div>
        
        <button 
          type="submit"
          :disabled="loading || !newItem.title"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create Grid Item</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useConvexQuery, useConvexMutation } from '@convex-vue/core'

import { api } from '~/convex/_generated/api'

const { data: gridItems, error, loading, refetch } = await useConvexQuery(api.gridItems.listGridItems, {})
const { mutate: createGridItem } = await useConvexMutation(api.gridItems.createGridItem)

const newItem = ref({
  title: '',
  description: '',
  category: '',
  url: '',
  imageUrl: '',
  order: 0,
  isActive: true
})

const items = computed(() => gridItems.value ?? [])

const handleCreateItem = async () => {
  if (!newItem.value.title) return
  try {
    await createGridItem(newItem.value)
    newItem.value = {
      title: '',
      description: '',
      category: '',
      url: '',
      imageUrl: '',
      order: 0,
      isActive: true
    }
    refetch()
  } catch (error) {
    console.error('Error creating grid item:', error)
  }
}

// SEO
useSeoMeta({
  title: 'ZenTile - Server-Side Convex Demo',
  description: 'Demo of server-side Convex integration with Nuxt 3'
})
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }
</style>
