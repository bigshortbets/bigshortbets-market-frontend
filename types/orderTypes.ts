export interface OrderType {
  timestamp: string;
  id: string;
  market: {
    id: string;
    ticker: string;
  };
  type: 'CLOSING' | 'OPENING';
  price: BigInt;
  side: 'LONG' | 'SHORT';
  quantity: BigInt;
}

export interface OrdersResponse {
  orders: OrderType[];
}

export interface OrderBookOrder {
  id: string;
  price: string;
  quantity: number;
}

export interface OrderBookResponse {
  aggregatedOrdersByPrices: OrderBookOrder[];
}
