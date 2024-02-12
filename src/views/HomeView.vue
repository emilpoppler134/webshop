<script setup lang="ts">
import { API_ADDRESS } from '../config'
import { fetchProducts } from '../database';

import type { IProduct } from '../database';

const products: Array<IProduct> | null = await fetchProducts();

if (products === null) {
  throw new Error("Failed to fetch");
}

const API_IMAGE_ADDRESS = API_ADDRESS + "/images/";
const image_size = "516x516";

</script>

<template>
  <section class="product-navigator">
    <div class="product-navigator--header">
      <span class="product-title">New arrivals</span>
      <!-- <router-link to="/products">
        <span class="see-more--button">
          <span>Shop All</span>
          <img :src="angleDownIcon" class="see-more--icon">
        </span>
      </router-link> -->
    </div>
    <div class="product-container">
      <div class="product-item" v-for="product, index in products" v-bind:key="index">
        <router-link :to="'/products/' + product._id">
          <div class="product-item--image">
            <img :src="API_IMAGE_ADDRESS + product.image.key + '_' + image_size + '.' + product.image.type" />
          </div>
          <div class="product-item--info">
            <span>{{ product.name }}</span>
            <span>{{ product.stock.length > 1 ? "From " + Math.min(...product.stock.map(item => item.price)) : product.stock[0].price }} SEK</span>
          </div>
        </router-link>
      </div>
    </div>
    <div class="dots">
      <div class="dot active"></div>
    </div>
  </section>
</template>

<style>
</style>
