import React from 'react';
import friendListData from '@/data/friends';
import { Card } from '@/components/ui/card';
import TabSwitch from './tab-switch';
import FriendCard from './friend-card';
import PendingCard from './pending-card';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';

interface FriendsPageProps {
  tab: string;
  page: number;
}

const FriendList: React.FC<FriendsPageProps> = ({ tab, page }) => {
  const itemsPerPage = Number(process.env.NEXT_PUBLIC_PAGINATION_PER_PAGE) || 4;
  const start = 1;
  const startIndex = (page - start) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = friendListData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(friendListData.length / itemsPerPage);

  return (
    <>
      <TabSwitch currentTab={tab} />
      <Card className='mt-5 p-4 border-none neo-effect'>
        {tab === 'all-friends' ? (
          currentData.map((profile) => (
            <FriendCard task={profile} key={profile.id} />
          ))
        ) : (
          currentData.length > 0 ? (
            currentData.map((profile) => (
              <PendingCard pending={profile} key={profile.id} />
            ))
          ) : (
            <div className='py-40 grid place-content-center'>
              <p className='text-center'>You have no pending invites</p>
              <Button className={`w-[330px] bg-[#956FD699] mt-8`}
              >
                Invite friend
              </Button>
            </div>
          )
        )}
      </Card>
      <div className='flex justify-center items-center mt-20'>
        {currentData.length > 0 && <Pagination totalPages={totalPages} currentPage={page} baseUrl="/friends" tab={tab} />}
      </div>
    </>
  );
};

export default FriendList;
