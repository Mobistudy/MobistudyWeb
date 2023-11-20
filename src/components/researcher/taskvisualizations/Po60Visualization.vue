<template>
    <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
    </div>
    <q-page>
      <q-table :rows="this.tableData()" :columns="this.columns()" row-key="field" :dense="true" class="q-mt-md" :hide-pagination="true">
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
  methods: {
    tableData () {
      return [
        { field: 'Max HR', value: this.data.po60Data.hrMax },
        { field: 'Min HR', value: this.data.po60Data.hrMin },
        { field: 'Avg HR', value: this.data.po60Data.hrAvg },
        { field: 'Max SPO2', value: this.data.po60Data.SPO2Max },
        { field: 'Min SPO2', value: this.data.po60Data.SPO2Min },
        { field: 'Avg SPO2', value: this.data.po60Data.SPO2Avg }
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
