<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
  </div>
  <q-table :rows="this.getRows()" :columns="this.getColumns()" row-key="field" :dense="true" class="q-mt-md" :hide-pagination="true" />
</template>

<script>
export default {
  props: ['data', 'completed'],
  methods: {
    getColumns () {
      return [
        { name: 'value', align: 'left', label: 'Health Data', field: 'value' },
        { name: 'po60', align: 'left', label: 'Value', field: 'po60' }
      ]
    },
    getRows () {
      return [
        { value: 'Max HR', po60: this.data.po60Data.hrMax },
        { value: 'Min HR', po60: this.data.po60Data.hrMin },
        { value: 'Avg HR', po60: this.data.po60Data.hrAvg },
        { value: 'Max SPO2', po60: this.data.po60Data.SPO2Max },
        { value: 'Min SPO2', po60: this.data.po60Data.SPO2Min },
        { value: 'Avg SPO2', po60: this.data.po60Data.SPO2Avg }
      ]
    }
  }
}
</script>

<style>

</style>
