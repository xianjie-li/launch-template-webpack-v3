<template>
  <div class="test-div">
    <img class="imgborder" width="200" src="../images/2.jpg" alt="">
    <Test2></Test2>
  </div>
</template>

<script>
  import Test2 from './Test2';

  export default {
    name: 'Test',
    components: { 
      Test2
    }
  }
</script>

<style lang="scss">
  .imgborder{
    width: 100px;
    &:hover {
      filter: grayscale(1.5);
    }
  }
</style>
