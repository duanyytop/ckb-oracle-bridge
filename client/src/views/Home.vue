<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/ckb_logo.png" />
    <PriceItem msg="CKB Oracle Bridge Price" />
  </div>
</template>

<script>
// @ is an alias to /src
import PriceItem from "@/components/PriceItem.vue";

export default {
  name: "Home",
  components: {
    PriceItem
  }
};
</script>
