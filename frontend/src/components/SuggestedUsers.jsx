import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";
import { setAuthUser } from "@/redux/authSlice";



const SuggestedUsers = ({onFollowUpdate}) => {

    const dispatch = useDispatch();
    const { suggestedUsers, user } = useSelector(store => store.auth);     

const followHandler = async (targetId) => {
  try {
    const res = await axios.post(
      `https://instaclone-0vg9.onrender.com/api/v1/user/followorunfollow/${targetId}`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      const isFollowing = user.following.includes(targetId);

      const updatedAuthUser = {
        ...user,
        following: isFollowing
          ? user.following.filter(id => id !== targetId)
          : [...user.following, targetId]
      };

      dispatch(setAuthUser(updatedAuthUser));

      const updatedSuggestedUsers = suggestedUsers.map(u =>
        u._id === targetId
          ? {
              ...u,
              followers: isFollowing
                ? u.followers.filter(id => id !== user._id)
                : [...u.followers, user._id]
            }
          : u
      );

      dispatch(setSuggestedUsers(updatedSuggestedUsers));
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


    // const { suggestedUsers } = useSelector(store => store.auth);
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((sUser) => {
                    const isFollowing = sUser.followers.includes(user._id)
                    return (
                        <div key={sUser._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${sUser?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={sUser?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${sUser?._id}`}>{sUser?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{sUser?.bio || 'Bio here...'}</span>
                                </div>
                            </div>
                            <button
              onClick={() => followHandler(sUser._id)}
              className={`text-xs font-bold cursor-pointer ${
                isFollowing ? "text-red-500 hover:text-red-700" : "text-[#3BADF8] hover:text-[#3495d6]"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers