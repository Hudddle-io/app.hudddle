import SearchFriendsPage from '@/components/pages/friends/search'
import React from 'react';


const SearchFriends = ({ params }: { params: { email: string } }) => {
  const decodedEmail = decodeURIComponent(params.email)
  return (
    <div><SearchFriendsPage search={decodedEmail} /></div>
  )
}

export default SearchFriends;
