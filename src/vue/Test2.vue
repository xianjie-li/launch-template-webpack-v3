<template lang="pug">
  div(:class="{[sty.cls]: true}") {{sty.cls}}
    span 这是一段pug的示例
</template>

<script>
export default {
  name: 'Test2',
  data() {
    return {};
  },
};
</script>

<style lang='scss' module="sty">
.cls {
  color: red;
}
.test {
  color: blue;
}
</style>