export const bestLocale = {
  methods: {
    // Finds the best local to display multi language text
    getBestLocale (obj) {
      const preferredLocale = this.$i18n.locale
      if (obj[preferredLocale]) return obj[preferredLocale]
      else {
        // get the first available
        for (const lang in obj) {
          if (obj[lang]) return obj[lang]
        }
      }
      // default
      return 'Unknown'
    }
  }
}
