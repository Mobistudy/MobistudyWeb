<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
  </div>
  <q-table :rows="getRows()" :columns="getColumns()" row-key="field" :dense="true" class="q-mt-md" :hide-pagination="true" />
</template>

<script>
export default {
  props: ['data', 'completed'],
  methods: {
    getValues () {
      const values = this.data.PEFs
      return values.sort().reverse()
    },
    getColumns () {
      return [
        { name: 'value', align: 'left', label: 'Value', field: 'value' },
        { name: 'peakflow', align: 'left', label: 'PeakFlow', field: 'peakflow' }
      ]
    },
    getRows () {
      return [
        { value: 'Highest value', peakflow: this.getValues()[0] },
        { value: 'Middle value', peakflow: this.getValues()[1] },
        { value: 'Lowest value', peakflow: this.getValues()[2] }
      ]
    }
  }
}
</script>

<style>

</style>
