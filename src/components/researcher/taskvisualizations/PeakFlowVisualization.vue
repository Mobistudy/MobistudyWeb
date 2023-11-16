<template>
  <div>
    <p class="taskVisualizationHeader">Completed: {{ completed }}</p>
  </div>
  <q-table :rows="getRows()" :columns="getColumns()" row-key="field" :dense="true" class="q-mt-md">
    <q-tr :props="props">
      <q-td v-for="col in props.cols" :key="col.name" :props="props">
        {{ col.value }}
      </q-td>
    </q-tr>
</q-table>
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
        { name: 'field', align: 'left', label: 'Data', field: 'field' },
        { name: 'value', align: 'left', label: 'Value', field: 'value' }
      ]
    },
    getRows () {
      return [
        { field: 'Highest value', value: this.getValues()[0] },
        { field: 'Middle value', value: this.getValues()[1] },
        { field: 'Lowest value', value: this.getValues()[2] }
      ]
    }
  }
}
</script>

<style>

</style>
