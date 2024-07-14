import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import  TextContent from '../components/CreateContest'

interface EventComponentProps {
  scheduledTime: string; // ISO 8601 string
}

const EventComponent: React.FC<EventComponentProps> = ({ scheduledTime }) => {
 
  useEffect(()=>{
    document.title = 'Create Contest | Livecode'
  },[])
    return(
        <TextContent />
    )   ;
};

export default EventComponent;
