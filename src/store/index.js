import Vuex from "vuex";
import Vue from "vue";
import shop from "@/api/shop";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
    cart: [],
    checkoutStatus: null,
  },
  getters: {
    availableProducts(state) {
      return state.products.filter((product) => product.inventory > 0);
    },
    cartProducts(state) {
      return state.cart.map((cartItem) => {
        const product = state.products.find(
          (product) => product.id === cartItem.id
        );
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity,
        };
      });
    },
    cartTotal(state, getters) {
      return getters.cartProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    },
    productIsInStock() {
      return (product) => {
        return product.inventory > 0;
      };
    },
  },
  actions: {
    fetchProducts({ commit }) {
      return new Promise((resolve) => {
        // API call
        shop.getProducts((products) => {
          console.log(products);
          commit("setProducts", products);
          resolve();
        });
      });
    },
    addProductToCart({ commit, state }, product) {
      if (product.inventory > 0) {
        const cartItem = state.cart.find((item) => item.id === product.id);
        if (!cartItem) {
          // add to cart
          commit("pushProductToCart", product.id);
        } else {
          // increment
          commit("incrementProductToCart", cartItem);
        }
        commit("decreaseProductInventory", product);
      }
    },
    removeProduct({ commit, state }, product) {
      const cartItem = state.cart.find((item) => item.id === product.id);
      if (cartItem.quantity > 1) {
        commit("decreaseProductFromCart", cartItem);
      } else {
        commit("removeProductFromCart", product.id);
      }
      commit("increaseProductInventory", product.id);
    },
    checkout({ commit, state }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit("emptyCart");
          commit("setCheckoutStatus", "success");
        },
        () => {
          commit("setCheckoutStatus", "fail");
        }
      );
    },
  },
  mutations: {
    setProducts(state, payload) {
      // update product Array
      state.products = payload;
    },
    pushProductToCart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1,
      });
    },
    incrementProductToCart(state, cartItem) {
      cartItem.quantity++;
    },
    decreaseProductInventory(state, product) {
      product.inventory--;
    },
    increaseProductInventory(state, productId) {
      let product = state.products.find((product) => product.id === productId);
      product.inventory++;
    },
    decreaseProductFromCart(state, cartItem) {
      cartItem.quantity--;
    },
    removeProductFromCart(state, productId) {
      state.cart.splice(
        state.cart.findIndex(function(item) {
          return item.id === productId;
        }),
        1
      );
    },
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },
    emptyCart(state) {
      state.cart = [];
    },
  },
});
