<template>
  <div>
    <h1>Product Lists</h1>
    <img v-if="loading" src="https://i.imgur.com/JfPpwOA.gif" />
    <ul v-else>
      <li v-for="product in products" :key="product.key">
        {{ product.title }} - {{ product.price | currency }} - {{product.inventory}}
        <button
          @click="addProductToCart(product)"
          :disabled="!productIsInStock(product)"
        >Add to cart</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState("products", {
      products: state => state.products
    }),
    ...mapGetters("products", ["productIsInStock"])
  },
  methods: {
    ...mapActions({
      fetchProducts: "products/fetchProducts",
      addProductToCart: "cart/addProductToCart"
    })
  },
  created() {
    this.loading = true;
    this.fetchProducts().then(() => (this.loading = false));
  }
};
</script>

<style></style>
