import { useAtom } from 'jotai';
import { formatDate } from '@/utils/formatDate';

import { currencySymbol } from '@/blockchain/constants';
import { chosenMarketAtom } from '@/store/store';
import { currentBlockAtom } from '../Market';
import { calculateMarketClosing } from '@/utils/calculateMarketClosing';

export const ContractDetails = () => {
  const [chosenMarket] = useAtom(chosenMarketAtom);
  const [blockHeight] = useAtom(currentBlockAtom);
  const { formattedDate } = calculateMarketClosing(
    Number(blockHeight),
    Number(chosenMarket?.lifetime)
  );

  const marketDurationRepresentation = `${formatDate(
    chosenMarket?.timestamp as unknown as string
  )} - ${formattedDate}`;

  const contractDetailsData = [
    { label: 'Contract name', value: chosenMarket?.ticker },
    { label: 'Market duration', value: marketDurationRepresentation },
    {
      label: 'Tick size',
      value: `${chosenMarket?.tickSize?.toString()!} ${currencySymbol}`,
    },
    {
      label: 'Initial margin',
      value: `${chosenMarket?.initialMargin?.toString()!} %`,
    },
    {
      label: 'Maintenance margin',
      value: `${chosenMarket?.maintenanceMargin?.toString()!} %`,
    },
    {
      label: 'Contract unit',
      value: `${chosenMarket?.contractUnit?.toString()!}`,
    },
  ];

  return (
    <div
      className={`w-full  bg-[#000211] rounded-lg font-semibold`}
      onClick={() => console.log(chosenMarket)}
    >
      <div className='justify-between items-center flex py-2  px-4'>
        <h3 className='text-sm '>Contract Details</h3>
      </div>

      <div className='flex flex-col font-normal text-xs'>
        {contractDetailsData.map((data, key) => (
          <div
            className='px-4 py-2 text-tetriary flex justify-between items-center'
            key={key}
          >
            <p className='capitalize'>{data.label}</p>
            <p>{data.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
