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
        v-model="multiText[lang]"
        @blur="blur()"
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
  emits: ['update:modelValue', 'blur'],
  computed: {
    multiText: {
      get () {
        let value = this.modelValue
        if (!value || Object.getPrototypeOf(value) !== Object.prototype) {
          value = {}
        }
        if (value.length < this.languages.length) {
          for (const lan in this.languages) {
            if (!value[lan]) value[lan] = ''
          }
        }
        return value
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    },
    inputtype () {
      if (this.type) return this.type
      else return 'text'
    }
  },
  methods: {
    blur () {
      this.$emit('blur', this.multiText)
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
