<template>
  <div class="flex items-center justify-center w-full h-screen text-center">
    <div class="w-full max-w-xs p-6">
      <div
        class="flex items-center justify-center text-5xl font-semibold text-gray-400"
      >
        {{ coin.toUpperCase() }}
      </div>
      <div
        v-if="last?.data?.p"
        :class="[
          'text-xl',
          last.data.p > prev.data.p
            ? 'text-green-500'
            : last.data.p === prev.data.p
            ? 'text-gray-800'
            : 'text-red-500',
        ]"
      >
        {{ currencyFormatter.format(parseFloat(last.data.p)) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { currencyFormatter, socketChange } from "~/utils";

export default {
  setup() {
    const data = ref<any>([]);
    const prev = ref<any>({});
    const last = ref<any>({});
    const coin = ref<string>("btc");
    let mess = {};

    const socket: WebSocket = new WebSocket(`wss://stream.binance.com/stream`);
    socket.onopen = function () {
      socketChange(socket, "SUBSCRIBE", coin.value);
    };
    socket.onmessage = function (message) {
      const response = JSON.parse(message.data);
      if (data.value.length > 50) {
        data.value.shift();
      }
      data.value.push(response);
      mess = response;
    };

    onMounted(() => {
      if (localStorage.coin) {
        coin.value = localStorage.coin;
      } else {
        localStorage.coin = coin.value;
      }

      window.onhashchange = () => {
        const hash: string = window.location.hash.replace("#", "");
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
      last.value = mess;
    }, 200);

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
