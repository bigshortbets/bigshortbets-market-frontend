import Image from 'next/image';
import { useEffect, useState } from 'react';
import logo from '../../public/logo.svg';
import { useAccount, useSignMessage, useSwitchChain } from 'wagmi';
import banner from '../../public/banner.svg';
import { bigshortbetsChain } from '@/blockchain/chain';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { selectedMarketIdAtom } from '../Market/Market';
import { useAtom } from 'jotai';
import { mintMessage } from '@/blockchain/constants';
import ReactLoading from 'react-loading';
import { useMutation } from '@tanstack/react-query';
import { MintData, bridgeApi } from '@/requests/bidgeApi/bridgeApi';
import axios from 'axios';
import { MintButton } from '../Market/Claim/MintButton';
import { FaChartLine, FaChartSimple, FaTrophy, FaUser } from 'react-icons/fa6';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useAtom(selectedMarketIdAtom);
  const { isConnected, chain, address } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (chain?.id != bigshortbetsChain.id) {
      switchChain({ chainId: bigshortbetsChain.id });
    }
  }, [isConnected]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openTrumpOrBidenMarket = () => {
    const trumpId = '9223372036854776644';
    const bidenId = '9223372036854776643';

    const randomNumber = Math.floor(Math.random() * 2);
    const selectedId = randomNumber === 0 ? trumpId : bidenId;

    setSelectedMarketId(selectedId);
  };
  const router = useRouter();

  const changeRoute = (route: string) => {
    if (router.pathname != 'route') {
      router.push(route);
    }
  };

  return (
    <nav className='bg-[#111217] w-full h-[64px]'>
      <div className=' flex justify-between h-full px-7 items-center'>
        <div className='flex gap-6 items-center'>
          <div
            className='flex gap-2 cursor-pointer'
            onClick={() => changeRoute('/')}
          >
            <Image src={logo} alt='BigShortBet$ Logo' width={50} priority />
            <div className='flex flex-col'>
              <p className='text-md hidden md:block'>bigshortbet$</p>
              <p className='md:text-xs text-[10px] font-semibold'>
                MARKET <span className='text-[#4ECB7D]'>PEER2PEER</span>{' '}
                <span className='text-[8px] md:text-[10px]'>TESTNET</span>
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='p-2 rounded bg-[#191B24]'
              onClick={() => changeRoute('/')}
            >
              <FaChartLine
                className={`text-sm hover:text-[#4ECB7D] cursor-pointer  transition ${
                  router.pathname === '/' && 'text-[#4ECB7D]'
                }`}
              />
            </button>
            <button
              className='p-2 rounded bg-[#191B24]'
              onClick={() => changeRoute('/leaderboard')}
            >
              <FaTrophy
                className={`text-sm hover:text-[#4ECB7D] cursor-pointer  transition ${
                  router.pathname === '/leaderboard' && 'text-[#4ECB7D]'
                }`}
              />
            </button>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden md:block'>
            <button onClick={openTrumpOrBidenMarket}>
              <Image src={banner} alt='banner' width={400} height={60} />
            </button>
          </div>
          {/*  <button
            className='p-2 rounded bg-[#191B24]'
            onClick={() => changeRoute('/')}
          >
            <FaUser
              className={`text-sm hover:text-[#4ECB7D] cursor-pointer  transition ${
                router.pathname === '/' && 'text-[#4ECB7D]'
              }`}
            />
          </button> */}
          {/* <MintButton /> */}
          {/*           {isConnected && <CurrentNetworkTab />} */}
          {/* <UIConfiguration /> */}
          {/* {isClient && <WalletConnect />} */}
          {isClient && (
            <ConnectButton
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'address',
              }}
              chainStatus={{
                smallScreen: 'icon',
                largeScreen: 'full',
              }}
              showBalance={false}
            />
          )}
        </div>
      </div>
    </nav>
  );
};
