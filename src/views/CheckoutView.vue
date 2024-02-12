<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { fetchProductsByStockId, sendPayment } from '../database';
import { parseCartStorage } from '../parseCartStorage';
import { form, validation, emailValidation, validateEmail, formatCCNumberInput, formatCCExpInput } from '../validation';
import { API_ADDRESS } from '../config';

import type { IStockExtended, IPayload, IStatus } from '../database';

import discountCodeIcon from '../assets/icons/discount-code.svg';
import cardVisaIcon from '../assets/icons/visa.svg';
import cardMastercardIcon from '../assets/icons/mastercard.svg';
import cardAmexIcon from '../assets/icons/amex.svg';

const router = useRouter();

const cart: Array<string> = parseCartStorage();

if (cart.length === 0) {
  throw new Error("Failed to fetch");
}

const products: Array<IStockExtended> | null = await fetchProductsByStockId(cart);

if (products === null) {
  throw new Error("Failed to fetch");
}

const API_IMAGE_ADDRESS = API_ADDRESS + "/images/";
const image_size = "516x516";

const shippingFee = 99;
const subtotal = products.map(item => item.price).reduce((a, b) => a + b, 0);

const manualMode = ref(true);

async function onSubmit() {
  for (const key in form.value) {
    if (!form.value[key as keyof typeof form.value]) {
      validation.value.invalid = true;
      return;
    }
  }

  const data = form.value;

  const payload: IPayload = {
    products: cart,
    promotionCode: null,
    customer: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      billing: {
        line1: data.line1,
        line2: null,
        postal_code: data.postal_code,
        city: data.city,
        state: null,
        country: data.country
      }
    },
    shipping: {
      name: data.name,
      phone: data.phone,
      address: {
        line1: data.line1,
        line2: null,
        postal_code: data.postal_code,
        city: data.city,
        state: null,
        country: data.country
      }
    },
    payment: {
      cc_name: data.cc_name,
      cc_number: data.cc_number,
      exp_month: data.cc_exp.split("/")[0].trim(),
      exp_year: data.cc_exp.trim().split("/")[1].trim(),
      cc_csc: data.cc_csc
    }
  }

  const paymentResponse: IStatus | null = await sendPayment(payload);

  if (paymentResponse === null) {
    throw new Error("Failed to fetch");
  }

  if (paymentResponse.status === "OK") {
    localStorage.setItem("cart", "[]");
    router.replace({path: "/checkout/success"});
  } else {
    console.error(paymentResponse.error);
  }
};

</script>

<template>
  <div class="checkout-view">
    <div class="app-multiItem">
      <div class="overview">
        <div class="product-summary">
          <span class="product-summary-header">Checkout</span>
          <span class="product-summary-amount">SEK {{ subtotal + shippingFee }}.00</span>
        </div>
        <section class="orderDetails">
          <ul class="orderDetails-list">
            <li class="orderDetails-item" v-for="item in products" v-bind:key="item._id">
              <img class="orderDetails-item--image" :src="API_IMAGE_ADDRESS + item.product.image.key + '_' + image_size + '.' + item.product.image.type" />
              <div class="orderDetails-item--info">
                <router-link :to="'/products/' + item.product._id" class="name">
                  <span>{{ item.product.name }}</span>
                </router-link>
                <span class="size">Size: {{ item.size }}</span>
              </div>
              <span class="price">SEK {{ item.price }}.00</span>
            </li>
          </ul>
          <div class="orderDetails-footer">
            <div class="subtotal-container">
              <span>Subtotal</span>
              <span>SEK {{ subtotal }}.00</span>
            </div>
            <div class="orderDetailsFooter-subtotalItems">
              <div class="promotionCodeEntry">
                <div class="promotionCodeEntry-container">
                  <input type="text" placeholder="Add promotion code" class="promotionCodeEntry-Input" autocapitalize="none" autocorrect="off" spellcheck="false">
                  <button class="promotionCodeEntry-ApplyButton">Apply</button>
                </div>
                <div class="promotionCodeEntry-applied">
                  <div class="coupon">
                    <img :src="discountCodeIcon">
                    <span class="promotionCodeEntry-code"></span>
                    <button class="remove-coupon">
                      <svg class="icon" fill="#697386" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 6.585l4.593-4.592a1 1 0 111.415 1.416L9.417 8l4.591 4.591a1 1 0 11-1.415 1.416L8 9.415l-4.592 4.592a1 1 0 11-1.416-1.416L6.584 8l-4.59-4.591a1 1 0 111.415-1.416L8 6.585z"></path>
                      </svg>
                    </button>
                  </div>
                  <span class="promotionCodeEntry-amount_off"></span>
                </div>
                <span class="promotionCodeEntry-status"></span>
              </div>
              <div class="shipping-container">
                <div class="orderDetails-shipping-label">
                  <span class="orderDetails-shipping-Text">Shipping</span>
                  <span class="orderDetails-shipping-Undertext">Sweden (1-3 busniess days)</span>
                </div>
                <span class="shipping-amount">SEK {{ shippingFee }}.00</span>
              </div>
            </div>
            <div class="orderDetails-total--container">
              <span>Total due</span>
              <span class="orderDetails-total">SEK {{ subtotal + shippingFee }}.00</span>
            </div>
          </div>
        </section>
      </div>
      <div class="app-payment">
        <form novalidate v-on:submit.prevent="onSubmit">
          <div class="global-fields">
            <div class="shipping-fields flex-wrap">
              <div class="flex-item">
                <span class="shippingDetails-Heading">Shipping information</span>
              </div>
              <div class="flex-item">
                <span class="checkoutInputHeader">Email</span>
                <input v-model="form.email" @change="validateEmail" type="text" class="checkoutInput full-border-radius" :class="{'invalid': emailValidation.invalid}" name="email" autocapitalize="none" autocomplete="email" autocorrect="off" spellcheck="false">
                <span v-show="emailValidation.invalid" class="validation-message">{{ emailValidation.message }}</span>
              </div>
              <div class="flex-item flex-wrap">
                <span class="checkoutInputHeader">Shipping address</span>
                <input v-model="form.name" type="text" class="checkoutInput top-border-radius" name="name" placeholder="Full name" autocapitalize="none" autocomplete="name" autocorrect="off" spellcheck="false">
                <select v-model="form.country" name="country" class="checkoutInput selector country">
                  <option value="SE">Sweden</option>
                </select>
                <div class="address_container" style="position: relative; width: 100%">
                  <input v-model="form.line1" type="text" class="checkoutInput address" name="address_line1" placeholder="Address" autocapitalize="none" autocomplete="address_line1" autocorrect="off" spellcheck="false">
                  <div class="google-suggestions">
                    <ul class="suggestion-list"></ul>
                  </div>
                </div>
                <input v-model="form.postal_code" v-show="manualMode" type="text" class="checkoutInput width-50" name="postal_code" placeholder="Postal code" autocapitalize="none" autocomplete="postal_code" autocorrect="off" spellcheck="false">
                <input v-model="form.city" v-show="manualMode" type="text" class="checkoutInput width-50" name="city" placeholder="Town or city" autocapitalize="none" autocomplete="address_level2" autocorrect="off" spellcheck="false">
                <input v-model="form.phone" type="text" class="checkoutInput bottom-border-radius" name="phone" placeholder="Phone" autocapitalize="none" autocomplete="tel" autocorrect="off" spellcheck="false">
                <span v-show="!manualMode" class="manual-button" @click="manualMode = true">Enter address manually</span>
              </div>
            </div>
            <div class="payment-fields flex-wrap">
              <div class="flex-item">
                <span class="shippingDetails-Heading">Payment details</span>
              </div>
              <div class="flex-item">
                <span class="checkoutInputHeader">Name on card</span>
                <input v-model="form.cc_name" type="text" class="checkoutInput full-border-radius" name="cc_name" autocapitalize="none" autocomplete="cc-name" autocorrect="off" spellcheck="false">
              </div>
              <div class="flex-item flex-wrap">
                <span class="checkoutInputHeader">Card information</span>
                <div style="position: relative; width: 100%;">
                  <input @input="formatCCNumberInput" v-model="form.cc_number" type="text" class="checkoutInput top-border-radius" name="cc_number" placeholder="1234 1234 1234 1234" autocapitalize="none" autocomplete="cc-number" autocorrect="off" spellcheck="false" maxlength='19'>
                  <div class="card-icons">
                    <img :src="cardVisaIcon" alt="Visa">
                    <img :src="cardMastercardIcon" alt="Mastercard">
                    <img :src="cardAmexIcon" alt="Amex">
                  </div>
                </div>
                <input @input="formatCCExpInput" v-model="form.cc_exp" type="text" class="checkoutInput width-50 bottom-left-border-radius" name="cc_exp" placeholder="MM / YY" autocapitalize="none" autocomplete="cc-exp" autocorrect="off" spellcheck="false" maxlength='7'>
                <input v-model="form.cc_csc" type="text" class="checkoutInput width-50 bottom-right-border-radius" name="cc_csc" placeholder="CVC" autocapitalize="none" autocomplete="cc-csc" autocorrect="off" spellcheck="false" maxlength='4'>
              </div>
              <span v-show="validation.invalid" class="validation-message">{{ validation.message }}</span>
            </div>
          </div>
          <div class="confirmPaymentContainer">
            <button class="SubmitButton" type="submit">
              <span class="SubmitButton-Text">Pay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
</style>
