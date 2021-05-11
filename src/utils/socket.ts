export function socketChange(socket: WebSocket, method: string, coin: string) {
  socket.send(
    JSON.stringify({
      method: method,
      params: [`${coin}usdt@aggTrade`],
      id: 1,
    })
  );
}
