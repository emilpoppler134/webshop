<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel, Tab, TabGroup, TabList, TabPanel, TabPanels, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import logo from '../assets/logo.svg';

export interface ISection {
  _id: string;
  name: string,
  categories: Array<ICategory>
  featured: Array<IFeatured>
}

export interface ICategory {
  _id: string;
  name: string,
  parent: string,
  collections: Array<ICollection>
}

export interface ICollection {
  _id: string;
  name: string,
  views: number,
  parent: string,
}

interface IFeatured {
  name: string,
  href: string,
  image: string,
  alt: string
}

const sections: Array<ISection> = await fetch("http://localhost:4000/sections/", {method: "GET"}).then((res) => (res.json()));

const navigation = {
  sections: sections.map((section: ISection) => (
    {
      id: section._id,
      name: section.name,
      categories: section.categories.map((category: ICategory) => (
        {
          id: category._id,
          name: category.name,
          collections: category.collections.map((collection: ICollection) => (
            {
              id: collection._id,
              name: collection.name,
              href: "/collections/" + collection._id
            }
          ))
        }
      )),
      featured: section.featured
    }
  )),
  pages: [
    { name: 'Company', href: '/company' },
    { name: 'Stores', href: '/stores' },
  ]
}

const open = ref(false)

</script>

<template>
  <div class="bg-white">
    <!-- Mobile menu -->
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-40 lg:hidden" @close="open = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div class="flex px-4 pb-2 pt-5">
                <button type="button" class="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" @click="open = false">
                  <span class="absolute -inset-0.5" />
                  <span class="sr-only">Close menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <!-- Links -->
              <TabGroup as="div" class="mt-2">
                <div class="border-b border-gray-200">
                  <TabList class="-mb-px flex space-x-8 px-4">
                    <Tab as="template" v-for="section in navigation.sections" :key="section.name" v-slot="{ selected }">
                      <button :class="[selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900', 'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium']">{{ section.name }}</button>
                    </Tab>
                  </TabList>
                </div>
                <TabPanels as="template">
                  <TabPanel v-for="section in navigation.sections" :key="section.name" class="space-y-10 px-4 pb-8 pt-10">
                    <div class="grid grid-cols-2 gap-x-4">
                      <div v-for="item in section.featured" :key="item.name" class="group relative text-sm">
                        <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                          <img :src="item.image" :alt="item.alt" class="object-cover object-center" />
                        </div>
                        <router-link :to="item.href" @click="open = false">
                          <span class="mt-6 block font-medium text-gray-900">
                            <span class="absolute inset-0 z-10" aria-hidden="true" />
                            {{ item.name }}
                          </span>
                        </router-link>
                        <p aria-hidden="true" class="mt-1">Shop now</p>
                      </div>
                    </div>
                    <div v-for="category in section.categories" :key="category.name">
                      <p :id="`${section.id}-${category.id}-heading-mobile`" class="font-medium text-gray-900">{{ category.name }}</p>
                      <ul role="list" :aria-labelledby="`${section.id}-${category.id}-heading-mobile`" class="mt-6 flex flex-col space-y-6">
                        <li v-for="collection in category.collections" :key="collection.name" class="flow-root">
                          <router-link :to="collection.href" @click="open = false">
                            <span class="-m-2 block p-2 text-gray-500">
                              {{ collection.name }}
                            </span>
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>

              <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                <div v-for="page in navigation.pages" :key="page.name" class="flow-root">
                  <router-link :to="page.href">
                    <span class="-m-2 block p-2 font-medium text-gray-900">
                      {{ page.name }}
                    </span>
                  </router-link>
                </div>
              </div>

              <!-- <div class="space-y-6 border-t border-gray-200 px-4 py-6">
                <div class="flow-root">
                  <router-link to="/signin">
                    <span class="-m-2 block p-2 font-medium text-gray-900">Sign in</span>
                  </router-link>
                </div>
                <div class="flow-root">
                  <router-link to="/signup">
                    <span class="-m-2 block p-2 font-medium text-gray-900">Create account</span>
                  </router-link>
                </div>
              </div> -->

              <div class="border-t border-gray-200 px-4 py-6">
                <span class="-m-2 flex items-center p-2">
                  <img src="https://freesvg.org/img/sweflag.png" alt="" class="block h-auto w-5 flex-shrink-0" />
                  <span class="ml-3 block text-base font-medium text-gray-900">SEK</span>
                  <span class="sr-only">, change currency</span>
                </span>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <header class="relative bg-white">
      <p class="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">Get free delivery on orders over $100</p>

      <nav aria-label="Top" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="border-b border-gray-200">
          <div class="flex h-16 items-center">
            <button type="button" class="relative rounded-md bg-white p-2 text-gray-400 lg:hidden" @click="open = true">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open menu</span>
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Logo -->
            <div class="ml-4 flex lg:ml-0">
              <router-link to="/">
                <span>
                  <span class="sr-only">Your Company</span>
                  <img class="h-14 w-auto" :src="logo"/>
                </span>
              </router-link>
            </div>

            <!-- Flyout menus -->
            <PopoverGroup class="hidden lg:ml-8 lg:block lg:self-stretch">
              <div class="flex h-full space-x-8">
                <Popover v-for="section in navigation.sections" :key="section.name" class="flex" v-slot="{ g }">
                  <div class="relative flex">
                    <PopoverButton :class="[g ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-800', 'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out']">{{ section.name }}</PopoverButton>
                  </div>

                  <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <PopoverPanel class="absolute inset-x-0 top-full text-sm text-gray-500">
                      <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
                      <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                      <div class="relative bg-white">
                        <div class="mx-auto max-w-7xl px-8">
                          <div class="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                            <div class="col-start-2 grid grid-cols-2 gap-x-8">
                              <div v-for="item in section.featured" :key="item.name" class="group relative text-base sm:text-sm">
                                <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                  <img :src="item.image" :alt="item.alt" class="object-cover object-center" />
                                </div>
                                <PopoverButton @click="$router.push(item.href)">
                                  <span class="mt-6 block font-medium text-gray-900">
                                    <span class="absolute inset-0 z-10" aria-hidden="true" />
                                    {{ item.name }}
                                  </span>
                                </PopoverButton>
                                <p aria-hidden="true" class="mt-1">Shop now</p>
                              </div>
                            </div>
                            <div class="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                              <div v-for="category in section.categories" :key="category.name">
                                <p :id="`${category.name}-heading`" class="font-medium text-gray-900">{{ category.name }}</p>
                                <ul role="list" :aria-labelledby="`${category.name}-heading`" class="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                  <li v-for="collection in category.collections" :key="collection.name" class="flex">
                                    <PopoverButton @click="$router.push(collection.href)">
                                      <span class="hover:text-gray-800">{{ collection.name }}</span>  
                                    </PopoverButton>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverPanel>
                  </transition>
                </Popover>

                <span v-for="page in navigation.pages" :key="page.name" class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                  <router-link :to="page.href">
                    <span>{{ page.name }}</span>
                  </router-link>
                </span>
              </div>
            </PopoverGroup>

            <div class="ml-auto flex items-center">
              <!-- <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                <router-link to="/signin">
                  <span class="text-sm font-medium text-gray-700 hover:text-gray-800">Sign in</span>
                </router-link>
                <span class="h-6 w-px bg-gray-200" aria-hidden="true" />
                <router-link to="/signup">
                  <span class="text-sm font-medium text-gray-700 hover:text-gray-800">Create account</span>
                </router-link>
              </div> -->

              <div class="hidden lg:ml-8 lg:flex">
                <span class="flex items-center text-gray-700 hover:text-gray-800">
                  <img src="https://freesvg.org/img/sweflag.png" alt="" class="block h-auto w-5 flex-shrink-0" />
                  <span class="ml-3 block text-sm font-medium">SEK</span>
                  <span class="sr-only">, change currency</span>
                </span>
              </div>

              <!-- Search -->
              <div class="flex lg:ml-6">
                <router-link to="/search">
                  <span class="p-2 text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Search</span>
                    <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
                  </span>
                </router-link>
              </div>

              <!-- Cart -->
              <div class="ml-4 flow-root lg:ml-6">
                <router-link to="/cart">
                  <span class="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                    <span class="sr-only">items in cart, view bag</span>
                  </span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<style>
</style>