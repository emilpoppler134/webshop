<script setup lang="ts">
import ContentLayout from './components/ContentLayout.vue'
import ContentSkeleton from './components/ContentSkeleton.vue'
</script>

<template>
  <Suspense>
    <ContentLayout />

    <template #fallback>
      <ContentSkeleton />
    </template>
  </Suspense>
</template>

<style>
</style>