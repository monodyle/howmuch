<template>
  <apexchart
    width="100%"
    height="200"
    type="area"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { onMounted, reactive, ref, watch } from "@vue/runtime-core";
import VueApexCharts from "vue3-apexcharts";
import { chartOptions } from "~/utils";
import { getPrices, getSeries } from "./fetcher";
import ChartSeries from "~/interfaces/Chart";

export default {
  name: "chart",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    prices: Array,
  },
  setup(props) {
    const _prices = reactive<any[]>(props.prices || []);
    const series = ref<ChartSeries<number[][]>[]>([
      {
        name: "Price",
        data: [],
      },
    ]);
    const fetchData = ref<number[][]>([]);

    watch(_prices, (values: any[]) => {
      const parser = values.map((item): number[] => [item.E, parseFloat(item.p)])
      const newSeries = getSeries([...fetchData.value, ...parser]);
      series.value = newSeries
    });

    onMounted(async () => {
      const response: any[] = await getPrices("SHIB");
      const result = response.map((item) => [item.T, parseFloat(item.p)]);
      fetchData.value = result;
    });

    return {
      chartOptions,
      series,
    };
  },
};
</script>
