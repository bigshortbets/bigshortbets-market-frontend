import {
  USER_HISTORY_QUERY,
  USER_MARKET_SETTLEMENTS_QUERY,
  USER_OPEN_POSITIONS_QUERY,
  USER_ORDERS_QUERY,
} from '@/requests/queries';
import { convertToSS58 } from '@/utils/convertToSS58';
import { useQuery } from '@apollo/client';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import {} from './TradingHub';
import { TradingHubOrders } from './TradingHubOrders/TradingHubOrders';
import { OrdersResponse } from '@/types/orderTypes';
import { PositionsResponse } from '@/types/positionTypes';
import { TradingHubPositions } from './TradingHubPositions/TradingHubPositions';
import { TradingHubHistory } from './TradingHubHistory/TradingHubHistory';
import { HistoryResponse } from '@/types/historyTypes';
import { useOpponentsMargin } from '@/blockchain/hooks/useOpponentsMargin';
import { useUnsettledLosses } from '@/hooks/useUnsettledLosses';
import { useCollateral } from '@/hooks/useCollateral';
import {
  tradingHubOrdersCountAtom,
  tradingHubPositionsCountAtom,
  tradingHubStateAtom,
} from '@/store/store';
import { ChatContainer } from './Chat/ChatContainer';
import { MarketSettlementsResponse } from '@/types/marketSettlementsTypes';

interface TradingHubContentContainerProps {
  isAggregated: boolean;
}

export const TradingHubContentContainer = ({
  isAggregated,
}: TradingHubContentContainerProps) => {
  const { address } = useAccount();
  const [, setOrdersCount] = useAtom(tradingHubOrdersCountAtom);
  const [, setPositionsCount] = useAtom(tradingHubPositionsCountAtom);
  const { data: ordersRes } = useQuery<OrdersResponse>(USER_ORDERS_QUERY, {
    pollInterval: 1000,
    variables: { userId: convertToSS58(address!) },
  });

  const { data: positionsRes } = useQuery<PositionsResponse>(
    USER_OPEN_POSITIONS_QUERY,

    {
      pollInterval: 1000,
      variables: { userId: convertToSS58(address!) },
    }
  );

  const { data: historyRes } = useQuery<HistoryResponse>(USER_HISTORY_QUERY, {
    pollInterval: 1000,
    variables: { userId: convertToSS58(address!) },
  });

  const { data: marketSettlementsRes } = useQuery<MarketSettlementsResponse>(
    USER_MARKET_SETTLEMENTS_QUERY,
    {
      pollInterval: 1000,
      variables: { userId: convertToSS58(address!) },
    }
  );

  useUnsettledLosses(positionsRes?.positions, address!);
  useCollateral(positionsRes?.positions, address!);

  const [tradingHubState] = useAtom(tradingHubStateAtom);
  useOpponentsMargin(positionsRes?.positions!, address!);

  useEffect(() => {
    if (ordersRes?.orders) {
      setOrdersCount(ordersRes.orders.length);
    }
    if (positionsRes?.positions) {
      setPositionsCount(positionsRes.positions.length);
    }
  }, [ordersRes?.orders, positionsRes?.positions]);

  return (
    <div
      className='w-full no-scrollbar'
      onClick={() => console.log(marketSettlementsRes)}
    >
      {tradingHubState === 'orders' && ordersRes && (
        <TradingHubOrders orders={ordersRes.orders} />
      )}
      {tradingHubState === 'positions' && positionsRes && (
        <TradingHubPositions
          isAggregated={isAggregated}
          positions={positionsRes.positions}
        />
      )}
      {tradingHubState === 'history' && historyRes && marketSettlementsRes && (
        <TradingHubHistory
          history={historyRes.orders}
          settlements={marketSettlementsRes.marketSettlements}
        />
      )}
      {/*  {tradingHubState === 'chat' && <ChatContainer />} */}
    </div>
  );
};
