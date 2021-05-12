import ky from 'ky'

export const getPrices = async (coin: string): Promise<any> => {
  const response = await ky
    .get(`aggTrades?limit=80&symbol=${coin.toUpperCase()}USDT`, {
      prefixUrl: 'https://www.binance.com/api/v1'
    })
    .json()
  return response
}
