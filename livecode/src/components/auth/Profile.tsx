import React from 'react'
import ButtonUI from '../Button'
import { useAuthActions } from '@/lib/authUtils'
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