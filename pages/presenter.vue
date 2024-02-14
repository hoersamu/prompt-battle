<script setup>
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://qvmyzaxnpycusghepyyz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bXl6YXhucHljdXNnaGVweXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5MzAxNDksImV4cCI6MjAyMzUwNjE0OX0.a1h9aPPhZcoflKeT9ZS0iKHyCLav4VnrQadmDRyRLHg')
const countries = ref([])

async function getCountries() {
  const { data } = await supabase.from('countries').select()
  countries.value = data
}

onMounted(() => {
  getCountries()
})
</script>

<template>
  <ul>
    <li v-for="country in countries" :key="country.id">{{ country.id }}</li>
  </ul>
</template>