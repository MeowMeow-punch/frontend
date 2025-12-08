<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-gray-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-xl font-bold">
        <RouterLink to="/" class="hover:text-gray-300">MyLogo</RouterLink>
      </div>

      <ul class="flex space-x-6">
        <li>
          <RouterLink 
            to="/" 
            class="hover:text-blue-400 transition duration-300" 
            active-class="text-blue-400 font-bold"
          >
            Home
          </RouterLink>
        </li>
        <li>
          <RouterLink 
            to="/about" 
            class="hover:text-blue-400 transition duration-300"
            active-class="text-blue-400 font-bold"
          >
            About
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>