import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

new Vuex.Store({
  state: {
    products: [],
  },
  getters: {
    productsCount() {
      // return
    },
  },
  actions: {
    fetchProducts() {
      // API call
    },
  },
  mutations: {
    setProducts() {
      // update product Array
    },
  },
});
