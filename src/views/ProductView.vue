<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { API_ADDRESS } from '../config';
import { fetchProduct } from '../database';
import type { IProduct } from '../database';

const route = useRoute();
const id = computed(() => route.params.id);
const extractedId = computed(() => id.value.toString()).value;

const product: IProduct | null = await fetchProduct(extractedId);

if (product === null) {
  throw new Error("Failed to fetch");
}

const API_IMAGE_ADDRESS = API_ADDRESS + "/images/";
const image_size = "516x516";

const price = product.stock.length > 1 ? "From " + Math.min(...product.stock.map(item => item.price)) : product.stock[0].price;

const selected = ref("");
const showAddedToCartMessage = ref(false);

const cart: Array<string> = parseCartStorage();

function parseCartStorage(): Array<string> {
  let localStorageCart: string | null = localStorage.getItem("cart");

  if (localStorageCart === null) {
    localStorage.setItem("cart", "[]");
    return [];
  }

  try { return JSON.parse(localStorageCart); }
  catch(err) { localStorage.setItem("cart", "[]"); return []; }
}

function onAddToCart() {
  if (selected.value === "") return;
  if (cart.includes(selected.value)) return;

  showAddedToCartMessage.value = true;

  try {
    cart.push(selected.value);
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch(err) { throw new Error("Couldn't add to cart"); }
}

</script>

<template>
  <div class="product-view">
    <img class="product-view--image" :src="API_IMAGE_ADDRESS + product.image.key + '_' + image_size + '.' + product.image.type" />
    <div class="product-side-content">
      <span class="product-side-content--text">{{ product.name }}</span>
      <span class="product-side-content--text">{{ selected === "" ? price : product.stock.find(item => item._id === selected)?.price }} SEK</span>

      <div class="selector-container">
        <select class="size-selector" v-model="selected" @change="showAddedToCartMessage = false">
          <option value="">Select size</option>
          <option v-for="item in product.stock" v-bind:key="item._id" :value="item._id" :disabled="item.quantity === 0 || cart.includes(item._id)">{{ item.size }}</option>
        </select>
        <div class="selector-outer">
          <span>{{ product.stock.find(item => item._id === selected)?.size || "Select size" }}</span>
          <svg viewBox="0 0 20 20" class="icon">
            <path d="M10 16l-4-4h8l-4 4zm0-12l4 4H6l4-4z"></path>
          </svg>
        </div>
      </div>

      
      <button 
        v-if="product.stock.some(item => item.quantity > 0)"
        v-show="!showAddedToCartMessage"
        class="add-to-cart--button"
        :class="{'available': selected !== ''}"
        @click="onAddToCart"
      >ADD TO CART</button>
      <span v-else class="soldout--text">Soldout</span>

      <span v-show="showAddedToCartMessage">Added to you cart!</span>
    </div>
  </div>
</template>

<style>
</style>
