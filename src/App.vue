<template>
  <div class="flex items-center justify-center w-full h-screen text-center">
    <div class="w-full max-w-xs p-6">
      <div
        class="flex items-center justify-center text-5xl font-semibold text-gray-400"
      >
        {{ coin.toUpperCase() }}
      </div>
      <div v-if="last">
        <span
          :class="[
            'text-xl',
            last > prev
              ? 'text-green-500'
              : last === prev
              ? 'text-gray-800'
              : 'text-red-500',
          ]"
        >
          {{ currencyFormatter(last) }}
        </span>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full overflow-hidden">
      <div class="-ml-6 -mr-2 pointer-events-none">
        <chart :prices="data" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { currencyFormatter, socketChange } from "~/utils";
import chart from "~/components/chart.vue";
import { SocketResponse } from "~/interfaces/PriceData";
import { DELAY_TIME } from "~/constants";

export default {
  components: { chart },
  setup() {
    const data = reactive<number[][]>([]);
    const prev = ref<string>("");
    const last = ref<string>("");
    const coin = ref<string>("btc");
    let mess: SocketResponse = {};
    let readyFlag: boolean = true;

    const socket: WebSocket = new WebSocket(`wss://stream.binance.com/stream`);
    socket.onopen = function () {
      socketChange(socket, "SUBSCRIBE", coin.value);
    };
    socket.onmessage = function (message) {
      const parser: SocketResponse = JSON.parse(message.data);
      const response = parser.data;
      if (!response) return;
      if (readyFlag) {
        data.push([response.E, parseFloat(response.p)]);
        readyFlag = false;
      }
      mess = parser;
    };

    onMounted(() => {
      const urlHash: string = window.location.hash?.replace("#", "");
      if (urlHash) {
        localStorage.coin = urlHash;
        coin.value = urlHash;
      } else if (localStorage.coin) {
        coin.value = localStorage.coin;
      } else {
        localStorage.coin = coin.value;
      }

      window.onhashchange = () => {
        const hash: string = window.location.hash?.replace("#", "");
        if (hash !== "") {
          socketChange(socket, "UNSUBSCRIBE", coin.value);
          localStorage.coin = hash;
          coin.value = localStorage.coin;
          socketChange(socket, "SUBSCRIBE", coin.value);
        }
      };
    });

    onUnmounted(() => {
      socketChange(socket, "UNSUBSCRIBE", coin.value);
    });

    setInterval(function () {
      prev.value = last.value;
      last.value = mess.data?.p || "";
      readyFlag = true;
    }, DELAY_TIME);

    return {
      coin,
      data,
      prev,
      last,
      currencyFormatter,
    };
  },
};
</script>
