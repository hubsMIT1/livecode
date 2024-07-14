import React, { useEffect, useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useParams } from 'react-router-dom';

interface EventDetailsProps {
  unavailableTimes: string[]; // ISO 8601 formatted strings
  handleSchedule: (unixDt: number) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ unavailableTimes, handleSchedule }) => {
  const { st } = useParams();
  const location = useLocation();
  const { start_time } = location.state || {};
  console.log(start_time)
  // console.log(dayjs(st))
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [editTime, setEditTime] = useState('');
  useEffect(() => {
    if (start_time) {
      const stDays = dayjs(start_time);
      setSelectedDate(stDays);
      setSelectedTime(stDays.format('HH:mm'));
      setEditTime(stDays.format('HH:mm'));
      handleSchedule(stDays.unix());
    }
  }, [start_time]);

  useEffect(() => {
    console.log(selectedDate, selectedTime)
  }, [selectedDate, selectedTime])

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
    if (selectedDate) {
      const [hour, minute] = event.target.value.split(':');
      const selectedDateTime = selectedDate.hour(parseInt(hour)).minute(parseInt(minute));
      const unixDT = selectedDateTime.unix();
      handleSchedule(unixDT);
    }
  };
  const isTimeDisabled = (time: string) => {
    if (!selectedDate) return true;

    const [hour, minute] = time.split(':');
    const selectedDateTime = selectedDate.hour(parseInt(hour)).minute(parseInt(minute));

    // Check if the time is in the past
    if (selectedDateTime.isBefore(new Date())) return true;

    // Check if the time is unavailable
    return unavailableTimes.some(unavailableTime => {
      const unavailable = new Date(unavailableTime);
      const diffMinutes = Math.abs(selectedDateTime.diff(unavailable, 'minute'));
      return diffMinutes <= 30;
    });
  };

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        // console.log(time);
        timeSlots.push(time);
      }
    }
    return timeSlots;
  };

  return (
    <div>
      <div className="pt-5 border-t border-gray-200 dark:border-gray-800 flex sm:flex-row flex-col sm:space-x-5 rtl:space-x-reverse">
        <div className='flex flex-col justify-center items-center'>
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white mt-1">Select Schedule</h3>

          <Space direction="vertical" className='bg-white dark:bg-gray-900 items-center'>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              disabledDate={current => current && current.isBefore(new Date(), 'day')}
              size="large"
              open={true}
              getPopupContainer={(trigger) => trigger.parentElement!}
              popupStyle={{ position: 'relative', top: 0, left: 0, zIndex: "0", textAlign: 'center' }}
              inputReadOnly
              style={{ pointerEvents: 'none', width: "288px", zIndex: '10', background: 'g', }}
            />
          </Space>
        </div>

        <div className="flex flex-col items-center justify-center sm:ms-7 sm:ps-5 sm:border-s border-gray-200 dark:border-gray-800 w-full mt-4 sm:mt-3">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white mt-1">
            {selectedDate ? selectedDate.format('dddd, MMMM D, YYYY') : 'Select a date'}
          </h3>

          <ul id="timetable" className="grid w-full grid-cols-2 gap-2 mt-5 overflow-auto h-[300px] no-scrollbar">
            {generateTimeSlots().map((time) => (
              <li key={time}>
                <input
                  type="radio"
                  id={time}
                  value={time}
                  className="hidden peer"
                  name="timetable"
                  checked={selectedTime === time}
                  onChange={handleTimeChange}
                  disabled={isTimeDisabled(time)}
                />
                <label
                  htmlFor={time}
                  className={`inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white hover:bg-blue-500 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500 ${isTimeDisabled(time) ? 'opacity-50 cursor-not-allowed' : ''
                    } ${selectedTime === time ? 'dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white hover:bg-blue-500 dark:peer-checked:bg-blue-500' : ''}`}
                >
                  {time}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;