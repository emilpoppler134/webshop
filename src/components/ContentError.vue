<script setup lang="ts">

defineProps({
  error: Error
})

</script>

<template>
  <p>Something went wrong...</p>
  <p>{{ error?.message }}</p>
</template>

<style>
</style>