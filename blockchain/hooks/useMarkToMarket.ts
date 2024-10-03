import { useWriteContract } from 'wagmi';
import { marketContract } from '../constants';
import { abi } from '../abi';
import toast from 'react-hot-toast';
import { bigshortbetsChain } from '../chain';
import { useEffect } from 'react';
import { handleBlockchainError } from '@/utils/handleBlockchainError';

export const useMarkToMarket = (marketId: string, positionId: string) => {
  const { writeContract, error, data, isSuccess } = useWriteContract();

  const notifText = `Mark-to-market initiated. A wallet notification will confirm once the process is complete.`;

  const write = () =>
    writeContract({
      address: marketContract as `0x${string}`,
      abi: abi,
      functionName: 'mark_to_market',
      args: [BigInt(marketId), BigInt(positionId)],
      chainId: bigshortbetsChain.id,
    });

  useEffect(() => {
    if (error) {
      handleBlockchainError(error.stack!);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(notifText, {
        duration: 4000,
      });
    }
  }, [isSuccess]);

  return { data, isSuccess, write };
};
