import React, { useEffect } from 'react'
import ButtonUI from '../Button'
import { useAuthActions } from '@/lib/authUtils'
import { refreshToken } from '@/lib/api'
const Profile:React.FC = ()=> {
  const {logoutUser} = useAuthActions()

  // useEffect(()=>{
  //     (async() =>{
  //         await refreshToken();
  //     })()
  // },[])
  return (
    <div>Profile comoing soon....

      <ButtonUI title='LogOut' handleSubmit={()=>logoutUser()} color='red'/>
    </div>
  )
}

export default Profile