<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

import ContentLayout from '@/components/ContentLayout.vue';
import ContentError from '@/components/ContentError.vue';
import ContentSkeleton from '@/components/ContentSkeleton.vue';

const error = ref<Error | null>(null)

onErrorCaptured(err => {
  error.value = err;
  return false;
});

</script>

<template>
  <ContentError v-if="error" :error="error" />
  <Suspense v-else>
    <ContentLayout />

    <template #fallback>
      <ContentSkeleton />
    </template>
  </Suspense>
</template>

<style>
</style>