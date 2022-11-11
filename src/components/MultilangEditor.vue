<template>
  <q-field
    color="black"
    error-message="Field is required."
    :error="!isValid"
  >
    <div>
      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel
          v-for="lang in languages"
          :key="lang"
          :name="lang"
        >
          <q-editor
            :ref="'input'+[lang]"
            :readonly="readonly"
            v-model="multiText[lang]"
            height="500px"
            max-height="500px"
            :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'strike', 'underline'],
        ['hr', 'link'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered'],
        ['fullscreen', 'viewsource']
      ]"
          />
        </q-tab-panel>
      </q-tab-panels>

      <q-tabs
        v-model="tab"
        dense
        inline-label
        align="left"
        switch-indicator
      >
        <q-tab
          v-for="lang in languages"
          :key="lang"
          :name="lang"
          :label="extendedLang(lang)"
        />
      </q-tabs>
    </div>
  </q-field>

</template>

<script>
export default {
  name: 'MultilangInput',
  props: {
    modelValue: Object,
    languages: Array,
    required: Boolean,
    readonly: Boolean
  },
  data () {
    return {
      tab: this.languages[0]
    }
  },
  emits: ['update:modelValue'],
  computed: {
    multiText: {
      get () {
        let value = this.modelValue
        if (!value || Object.getPrototypeOf(value) !== Object.prototype) {
          value = {}
        }
        if (value.length < this.languages.length) {
          for (const lan of this.languages) {
            if (!value[lan]) value[lan] = ''
          }
        }
        return value
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    },
    isValid () {
      if (this.required) {
        for (const lan of this.languages) {
          if ((!this.modelValue[lan]) || (this.modelValue[lan].length === 0)) {
            return false
          }
        }
        return true
      } else return true
    }
  },
  methods: {
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
