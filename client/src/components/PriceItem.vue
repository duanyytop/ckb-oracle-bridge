<template>
  <md-list-item>
    <md-avatar>
      <img src="https://placeimg.com/40/40/people/1" alt="People" />
    </md-avatar>
    <div class="md-list-item-text">
      <span>{{ msg }}</span>
      <span>Brunch this weekend?</span>
      <p>I'll be in your neighborhood doing errands this week. Do you want to meet?</p>
    </div>
  </md-list-item>
</template>

<script>
export default {
  name: 'PriceItem',
  props: {
    msg: String,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 0 0;
}
</style>
