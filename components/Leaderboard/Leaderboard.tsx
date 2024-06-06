import React, { useState } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { LeaderboardItem } from './LeaderboardItem';
import { useAccount } from 'wagmi';
import { FaSearch } from 'react-icons/fa';
import { PrizesModal } from './PrizesModal';
import { useQuery as gqlQuery } from '@apollo/client';

import { LeaderboardResponse } from '@/types/leaderboardTypes';
import { LEADERBOARD_QUERY } from '@/requests/queries';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const Leaderboard = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7];
  const { address } = useAccount();
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModalOpened(false);
  };

  const { data: leaderboardRes } =
    gqlQuery<LeaderboardResponse>(LEADERBOARD_QUERY);

  const [currentRanking, setCurrentRanking] = useState('general');

  const { isPending, error, data } = useQuery({
    queryKey: ['bigsbPrice'],
    queryFn: () =>
      fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bigshortbets&vs_currencies=usd'
      ).then((res) => res.json()),
  });
  return (
    <div className='bg-[#111217] relative min-h-screen'>
      <img
        src='/chartbg.svg'
        alt=''
        className='w-full h-full absolute inset-0 pointer-events-none z-0'
      />
      <div className='h-[100dvh] max-w-[2000px] mx-auto flex flex-col pb-4 items-center relative z-10'>
        <Navbar />
        <div className='max-w-[1420px] flex-grow border-[#444650] border-2 rounded-[10px] w-full mt-4 bg-[#191B24] overflow-auto no-scrollbar'>
          <div className='pt-6 px-6'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex items-center gap-5'>
                <h2 className='text-white text-lg font-semibold'>
                  Leaderboard 🏆
                </h2>
                <button
                  className='h-[35px] w-[100px] bg-[#1e2029] text-white text-[13px] rounded-lg font-bold border-[#444650] border-2'
                  onClick={() => setIsModalOpened(true)}
                >
                  Prizes 🎁
                </button>
              </div>
              <div>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => setCurrentRanking('general')}
                      className={`h-[35px] w-[160px]  text-xs rounded-lg ${
                        currentRanking === 'general'
                          ? 'text-black bg-[#4ECB7D]  font-bold'
                          : 'bg-[#23252E] text-white'
                      }`}
                    >
                      General ranking
                    </button>
                    <button
                      onClick={() => setCurrentRanking('usa')}
                      className={`h-[35px] w-[160px]  text-xs rounded-lg ${
                        currentRanking === 'usa'
                          ? 'text-black bg-[#4ECB7D]  font-bold'
                          : 'bg-[#23252E] text-white'
                      }`}
                    >
                      Trump/Biden ranking
                    </button>
                  </div>
                  <div className='h-[35px] w-[200px] flex bg-[#23252E] rounded-lg'>
                    <input
                      type='text'
                      className=' text-white  px-3 text-xs  rounded-lg h-full w-[85%] bg-[#23252E]  outline-none'
                      placeholder='Search address'
                    />
                    <div className='flex-grow text-[#444650] flex items-center'>
                      <FaSearch />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-[5px]'>
              <div className='w-full rounded-lg mb-1 h-[40px] bg-[#23252E] flex items-center px-4 justify-between even:bg-[#191B24]'>
                <div className='flex'>
                  <div className='w-[100px] items-center text-[13px] font-semibold'>
                    Position
                  </div>
                  <div className='w-[130px] items-center text-[13px] font-semibold'>
                    Address
                  </div>
                  <div className='w-[100px] items-center text-[13px] font-semibold'>
                    Prize
                  </div>
                </div>
                <div className='w-[100px] text-right items-center text-[13px] font-semibold'>
                  Score
                </div>
              </div>
              {address && (
                <div className='w-full rounded-lg h-[40px] bg-[#23252E] flex items-center px-4 justify-between even:bg-[#1e2029] mb-4'>
                  <div className='flex'>
                    <div className='w-[100px] items-center text-[13px]'>
                      312
                    </div>
                    <div className='text-[13px] flex items-center gap-2'>
                      <p>{`0sda...dasd (You)`}</p>
                    </div>
                  </div>
                  <div className='text-right items-center text-[12px]'>
                    +3.000 $DOLARS
                  </div>
                </div>
              )}
              {leaderboardRes &&
                leaderboardRes.generalLeaderboards.map((item, key) => (
                  <LeaderboardItem
                    position={key + 1}
                    key={key}
                    address={item.user}
                    score={item.balanceChange}
                    bigsbPrice={data.bigshortbets.usd}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <PrizesModal
        handleCloseModal={handleCloseModal}
        isModalOpened={isModalOpened}
      />
    </div>
  );
};
