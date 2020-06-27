<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.quantity }} x {{product.title}} : {{ product.price * product.quantity | currency }}
        <button
          @click="removeProduct(product)"
        >-</button>
      </li>
    </ul>
    <p>Total = {{Total | currency}}</p>
    <button @click="checkout()" :disabled="checkoutDisabled">Checkout</button>
    <p v-if="$store.state.checkoutStatus">{{ $store.state.checkoutStatus }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      products: "cartProducts",
      Total: "cartTotal"
    }),
    checkoutDisabled() {
      if (this.Total > 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    ...mapActions(["removeProduct", "checkout"])
  }
};
</script>

<style>
</style>