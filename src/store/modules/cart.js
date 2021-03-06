import shop from "@/api/shop";

export default {
  namespaced: true,
  state: {
    cart: [],
    checkoutStatus: null,
  },
  getters: {
    cartProducts(state, getters, rootState) {
      return state.cart.map((cartItem) => {
        const product = rootState.products.products.find(
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
  },
  actions: {
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
        commit("products/decreaseProductInventory", product, { root: true });
      }
    },
    removeProduct({ commit, state }, product) {
      const cartItem = state.cart.find((item) => item.id === product.id);
      if (cartItem.quantity > 1) {
        commit("decreaseProductFromCart", cartItem);
      } else {
        commit("removeProductFromCart", product.id);
      }
      commit("products/increaseProductInventory", product.id);
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
    pushProductToCart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1,
      });
    },
    incrementProductToCart(state, cartItem) {
      cartItem.quantity++;
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
    emptyCart(state) {
      state.cart = [];
    },
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },
  },
};
