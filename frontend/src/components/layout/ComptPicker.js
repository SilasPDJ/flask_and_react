import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, YearCalendar, MonthCalendar } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br'; // Import Portuguese locale data
import ModalDiv from './ModalDiv';

const getDayJsNewObj = (obj) => {
  const day = obj.day()
  const month = obj.month()
  const year = obj.year();
  return dayjs(new Date(year, month, day))
}

export default function ComptPicker({ referenceDate, handleMonthChange, handleYearChange, openModalButtonId }) {
  const [currentReferenceDate, setCurrentReferenceDate] = React.useState(referenceDate);

  const handleMonthCalendarChange = (newMonth) => {

    const updatedReferenceDate = getDayJsNewObj(newMonth)
    setCurrentReferenceDate(updatedReferenceDate);
    handleMonthChange(updatedReferenceDate)
  };

  const handleYearCalendarChange = (newYear) => {
    const updatedReferenceDate = getDayJsNewObj(newYear)
    setCurrentReferenceDate(updatedReferenceDate);
    handleYearChange(updatedReferenceDate)

  };

  return (
    <ModalDiv openModalTitle={'Selecione a Competência'} closeModalTitle={'Fechar'} description="Selecione a competência" fontColor={'white'} openModalButtonId={openModalButtonId}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <hr />
        <MonthCalendar
          referenceDate={currentReferenceDate}
          onChange={handleMonthCalendarChange}
          key={'monthCalendar'}
        />
        <hr />
        <YearCalendar
          yearsPerRow={3}
          sx={{
            borderRadius: 2,
            height: 250,
          }}
          referenceDate={currentReferenceDate}
          onChange={handleYearCalendarChange}
          key={'yearCalendar'}
        />
        <hr />
      </LocalizationProvider>
    </ModalDiv>
  );
}
