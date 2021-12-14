<template>
  <div class="flex items-center justify-center w-full h-screen text-center">
    <div class="w-full max-w-xs p-6">
      <div
        class="flex items-center justify-center text-6xl font-bold text-gray-400 "
      >
        {{ symbol.toUpperCase() }}
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
  </div>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { currencyFormatter, socketChange } from "~/utils";
import { SocketResponse } from "~/interfaces/PriceData";
import { DELAY_TIME } from "~/constants";

export default {
  setup() {
    const prev = ref<string>("");
    const last = ref<string>("");
    const symbol = ref<string>("btc");
    let mess: SocketResponse = {};

    const socket: WebSocket = new WebSocket(`wss://stream.binance.com/stream`);
    socket.onopen = function () {
      socketChange(socket, "SUBSCRIBE", symbol.value);
    };
    socket.onmessage = function (message) {
      const parser: SocketResponse = JSON.parse(message.data);
      const response = parser.data;
      if (!response) return;
      mess = parser;
    };

    onMounted(() => {
      const urlHash: string = window.location.hash?.replace("#", "");
      if (urlHash) {
        localStorage.symbol = urlHash;
        symbol.value = urlHash;
      } else if (localStorage.symbol) {
        symbol.value = localStorage.symbol;
      } else {
        localStorage.symbol = symbol.value;
      }

      window.onhashchange = () => {
        const hash: string = window.location.hash?.replace("#", "");
        if (hash !== "") {
          socketChange(socket, "UNSUBSCRIBE", symbol.value);
          localStorage.symbol = hash;
          symbol.value = localStorage.symbol;
          socketChange(socket, "SUBSCRIBE", symbol.value);
        }
      };
    });

    onUnmounted(() => {
      socketChange(socket, "UNSUBSCRIBE", symbol.value);
    });

    setInterval(function () {
      prev.value = last.value;
      last.value = mess.data?.p || "";
    }, DELAY_TIME);

    return {
      symbol,
      prev,
      last,
      currencyFormatter,
    };
  },
};
</script>
