import React, {  useEffect } from 'react';
import  TextContent from '../components/CreateContest'

// interface EventComponentProps {
//   scheduledTime: string; // ISO 8601 string
// }

const EventComponent: React.FC = () => {
 
  useEffect(()=>{
    document.title = 'Create Contest | Livecode'
  },[])
    return(
        <TextContent />
    )   ;
};

export default EventComponent;
