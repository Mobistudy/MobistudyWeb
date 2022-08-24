<template>
  <div>
    <div
      v-for="lang in languages"
      :key="lang"
    >
      <q-input
        :type="inputtype"
        :autogrow="inputtype == 'textarea'"
        :readonly="readonly"
        :value="modelValue[lang]"
        @blur="blur()"
        @input="update()"
        :hint="'Text in '+extendedLang(lang)"
        :rules="[val => (!required || !!val) || 'Field is required.']"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultilangInput',
  props: {
    modelValue: Object,
    languages: Array,
    required: Boolean,
    readonly: Boolean,
    type: String
  },
  emits: ['update:modelValue'],
  computed: {
    inputtype () {
      if (this.type) return this.type
      else return 'text'
    }
  },
  methods: {
    update () {
      this.$emit('update:modelValue', this.modelValue)
    },
    blur () {
      this.$emit('update:modelValue', this.modelValue)
    },
    extendedLang (lang) {
      if (lang === 'en') return 'English'
      if (lang === 'sv') return 'Swedish'
      if (lang === 'it') return 'Italian'
      if (lang === 'es') return 'Spanish'
      return lang
    }
  }
}
</script>
