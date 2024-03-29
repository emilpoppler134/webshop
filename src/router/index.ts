import { createRouter, createWebHistory } from 'vue-router';

import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import CollectionView from '../views/CollectionView.vue';
import CompanyView from '../views/CompanyView.vue';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import SearchView from '../views/SearchView.vue';
import SigninView from '../views/SigninView.vue';
import SignupView from '../views/SignupView.vue';
import StoreView from '../views/StoreView.vue';
import SuccessView from '../views/SuccessView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView
    },
    {
      path: '/checkout/success',
      name: 'success',
      component: SuccessView
    },
    {
      path: '/company',
      name: 'company',
      component: CompanyView
    },
    {
      path: '/stores',
      name: 'stores',
      component: StoreView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/collections/:id',
      name: 'collection',
      component: CollectionView
    },
    {
      path: '/products/:id',
      name: 'product',
      component: ProductView
    }
  ]
})

export default router
