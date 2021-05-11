// https://binance-docs.github.io/apidocs/spot/en/#aggregate-trade-streams

export interface PriceData {
  E: number // Event time
  p: string // Price
}

export interface SocketResponse {
  stream?: string
  data?: PriceData
}
