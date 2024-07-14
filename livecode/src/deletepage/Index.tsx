

import React,{useEffect} from 'react'
import axios from 'axios'
function Index() {

    
    // const res = async() =>
    
    // useEffect(() => {
        const resp = async () => {
          console.log('CLicked')
          // const res =  await axios.get('https://svipee-backend.onrender.com/api/auth/check-username?username=shivi');
          // const data = await res.data;
          const response = await fetch('https://svipee-backend.onrender.com/api/auth/check-username?username=shivi')
          const data = await response.json();

          console.log(data)
          return data;
        }

        // console.log(resp());
    //   return () => {
    //     // second
    //   }
    // }, [])
    
  return (
    <div onClick={resp} className='cursor-pointer'> API TEST </div>
  )
}

export default Index