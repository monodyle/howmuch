export const chartOptions = {
  chart: {
    id: "price_changes",
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
    style: "hollow",
  },
  xaxis: {
    type: "datetime"
  },
  tooltip: {
    x: {
      format: "dd MMM yyyy",
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100],
    },
  },
}
