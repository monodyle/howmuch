<template>
  <apexchart
    width="100%"
    height="200"
    type="area"
    :options="chartOptions"
    :series="[
      {
        name: 'Price',
        data: data,
      },
    ]"
  ></apexchart>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from "@vue/runtime-core";
import VueApexCharts from "vue3-apexcharts";
import { chartOptions } from "~/utils";
import { getPrices } from "./fetcher";

export default {
  name: "chart",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    prices: Array,
  },
  setup(prop) {
    const data = ref<number[][]>([]);
    const dynamic = reactive({
      prices: JSON.parse(JSON.stringify(prop.prices)),
    });

    onMounted(async () => {
      const response: any[] = await getPrices("SHIB");
      data.value = response.map((item) => [item.T, parseFloat(item.p)]);
    });

    return {
      chartOptions,
      data: [...data.value, ...dynamic.prices],
    };
  },
};
</script>
