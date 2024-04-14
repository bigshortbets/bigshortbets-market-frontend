import { PositionWithSide } from '@/types/positionTypes';
import { useState } from 'react';
import { SideLabel } from '../SideLabel';
import { truncateAddress } from '@/utils/truncateAddress';
import { getOpponentMarginData } from '@/utils/getOpponentMarginData';
import { opponentsMarginsAtom } from '../../Market';
import { useAtom } from 'jotai';
import { LiquidationStatusTab } from '../../LiquidationStatusTab';
import { LiquidationStatusType } from '@/blockchain/hooks/useUserMargin';
import { Tooltip } from 'react-tooltip';
import { useMarkToMarket } from '@/blockchain/hooks/useMarkToMarket';
import { ClosePositionModal } from './ClosePositionModal';

interface TradingHubPositionsItemProps {
  position: PositionWithSide;
  oraclePrice: BigInt;
}

export const TradingHubPositionsItem = ({
  position,
  oraclePrice,
}: TradingHubPositionsItemProps) => {
  const opponent = position.side === 'LONG' ? position.short : position.long;
  const calculatedProfitOrLoss =
    position.side === 'LONG'
      ? Number(position.quantityLeft) *
        Number(position.market.contractUnit) *
        (Number(oraclePrice.toString()) - Number(position.price.toString()))
      : Number(position.quantityLeft) *
        Number(position.market.contractUnit) *
        (Number(position.price.toString()) - Number(oraclePrice.toString()));

  const { write: writeMarkToMarket } = useMarkToMarket(
    position.market.id,
    position.id
  );

  const [opponentsMargin] = useAtom(opponentsMarginsAtom);

  const marginData = getOpponentMarginData(
    opponentsMargin,
    opponent,
    position.market.id
  );

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  return (
    <tr
      className={`text-sm even:bg-[#23252E] text-[#7F828F] 
  }`}
    >
      <td className="pl-3 py-3">
        <SideLabel side={position.side} />
      </td>
      <td>{Number(position.quantityLeft)}</td>
      <td>{Number(position.price)}</td>
      <td
        className={`${
          calculatedProfitOrLoss < 0
            ? 'text-red-500'
            : 'text-[#73D391] font-semibold'
        }`}
      >
        {calculatedProfitOrLoss.toFixed(2)}{' '}
        <span className={`text-xs`}>USDC</span>
      </td>

      <td className="align-middle">
        <div className="flex items-center space-x-2">
          <p>{truncateAddress(opponent)}</p>
          <LiquidationStatusTab
            status={marginData?.liquidationStatus! as LiquidationStatusType}
            small
          />
        </div>
      </td>

      <td className=" text-right pr-3 ">
        <a
          data-tooltip-id="m2m-tooltip"
          data-tooltip-html="Mark-to-Market (MTM): Instantly updates your</br> asset values based  on current market conditions.</br> On our peer-to-peer market, this action is </br>executed on demand, ensuring transparency without</br> daily automatic adjustments."
        >
          <button
            className="mr-4 text-xs font-semibold text-[#4ECB7D] hover:underline"
            onClick={() => writeMarkToMarket()}
          >
            MTM
          </button>
        </a>

        <button
          onClick={() => setIsModalOpened(true)}
          className={`font-bold text-xs hover:underline transition ease-in-out text-[#C53F3A] duration-300`}
        >
          CLOSE
        </button>
      </td>
      <Tooltip id="m2m-tooltip" />
      <ClosePositionModal
        handleCloseModal={handleCloseModal}
        isModalOpened={isModalOpened}
        position={position}
        profitLoss={calculatedProfitOrLoss}
      />
    </tr>
  );
};
