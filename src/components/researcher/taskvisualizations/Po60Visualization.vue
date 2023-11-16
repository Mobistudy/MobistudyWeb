<template>
    <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
    </div>
    <q-page>
      <q-table
        :rows="tableData"
        :columns="columns"
        row-key="field"
        :dense="true"
        :rows-per-page-options="[10, 20, 50]"
        class="q-mt-md"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-page>
  </template>
<script>
export default {
  props: ['data', 'completed'],
  computed: {
    healthData () {
      return this.data
    },
    tableData () {
      return [
        { field: 'Max HR', value: this.healthData.po60Data.hrMax },
        { field: 'Min HR', value: this.healthData.po60Data.hrMin },
        { field: 'Avg HR', value: this.healthData.po60Data.hrAvg },
        { field: 'Max SPO2', value: this.healthData.po60Data.SPO2Max },
        { field: 'Min SPO2', value: this.healthData.po60Data.SPO2Min },
        { field: 'Avg SPO2', value: this.healthData.po60Data.SPO2Avg }
      ]
    },
    columns () {
      return [
        { name: 'field', align: 'left', label: 'Health Data', field: 'field' },
        { name: 'value', align: 'left', label: 'Value', field: 'value' }
      ]
    }
  }
}
</script>
<style>
</style>
