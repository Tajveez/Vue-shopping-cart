import shop from "@/api/shop";

export default {
  namespaced: true,
  state: {
    products: [],
  },
  getters: {
    availableProducts(state) {
      return state.products.filter((product) => product.inventory > 0);
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
  },
  mutations: {
    setProducts(state, payload) {
      // update product Array
      state.products = payload;
    },
    decreaseProductInventory(state, product) {
      product.inventory--;
    },
    increaseProductInventory(state, productId) {
      let product = state.products.find((product) => product.id === productId);
      product.inventory++;
    },
  },
};
