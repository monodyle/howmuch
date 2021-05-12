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
import { reactive, ref, watch } from "@vue/runtime-core";
import VueApexCharts from "vue3-apexcharts";
import { chartOptions } from "~/utils";
import ChartSeries from "~/interfaces/Chart";

type TProps = Readonly<{} & { prices?: unknown[] }>;

const getSeries = (data: any) => {
  return [{ name: "Price", data }];
};

export default {
  name: "chart",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    prices: Array,
  },
  setup(props: TProps) {
    const prices = reactive<any[]>(props.prices || []);
    const series = ref<ChartSeries<number[][]>[]>(getSeries([]));

    watch(prices, (values: any[]) => {
      const newSeries = getSeries([...values]);
      series.value = newSeries;
    });

    return {
      chartOptions,
      series,
    };
  },
};
</script>
