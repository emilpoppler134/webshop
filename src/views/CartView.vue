<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { fetchProductsByStockId } from '../database';
import { parseCartStorage } from '../parseCartStorage';
import { API_ADDRESS } from '../config';

import type { IStockExtended } from '../database';

const router = useRouter();

const cart: Array<string> = parseCartStorage();
const products: Array<IStockExtended> | null = cart.length > 0 ? await fetchProductsByStockId(cart) : [];

if (products === null) {
  throw new Error("Failed to fetch");
}

const line_items = ref(products.map(item => {
  return {
    id: item._id,
    productID: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.price,
    size: item.size
  };
}));

const API_IMAGE_ADDRESS = API_ADDRESS + "/images/";
const image_size = "516x516";

const shippingFee = 99;

function onRemoveFromCart(id: string) {
  const index = line_items.value.findIndex(item => {
    return item.id === id;
  });
  line_items.value.splice(index, 1);

  cart.splice(cart.indexOf(id), 1);
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function onCheckout() {
  if (cart.length === 0) return;
  router.push({ path: '/checkout' });
}

</script>

<template>
  <div class="cart-view">
    <div class="cart-product-list">
      <div class="cart-item" v-for="item in line_items" v-bind:key="item.id">
        <router-link class="cart-item--content" :to="'/products/' + item.productID">
          <img class="cart-item--image" :src="API_IMAGE_ADDRESS + item.image.key + '_' + image_size + '.' + item.image.type" />
          <div class="cart-item--info">
            <span>{{ item.name }}</span>
            <span>Size: {{ item.size }}</span>
            <span>Price: {{ item.price }} SEK</span>
          </div>
        </router-link>
        <div class="remove-from-cart">
          <button class="remove-from-cart--button" @click="onRemoveFromCart(item.id)">
            <svg class="icon" viewBox="0 0 352 512">
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
          </button>
        </div>
        <div class="overlay"></div>
      </div>
    </div>
    <div class="cart-summary">
      <div class="summary-item">
        <span>Summary</span>
      </div>
      <div class="summary-item">
        <span>Subtotal</span>
        <span>{{ line_items.map(item => item.price).reduce((a, b) => a + b, 0) }}.00 SEK</span>
      </div>
      <div class="summary-item">
        <span>Shipping</span>
        <span>{{ shippingFee }}.00 SEK</span>
      </div>
      <div class="summary-item summary-item--bordered">
        <span>Total</span>
        <span>{{ line_items.map(item => item.price).reduce((a, b) => a + b, 0) + shippingFee }}.00 SEK</span>
      </div>

      <button class="checkout-button" :class="{'disabled': cart.length === 0}" @click="onCheckout">Checkout</button>
    </div>
  </div>
</template>

<style>
</style>
