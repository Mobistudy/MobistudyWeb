<template>
  <div class="my-input">
    <q-input
      id="input"
      v-model="text"
    ></q-input>
  </div>
</template>

<style>
.my-input {
  border: dotted;
}
</style>

<script>
export default {
  name: 'myInput',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    text: {
      get () {
        return this.modelValue
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    }
  }
}
</script>
