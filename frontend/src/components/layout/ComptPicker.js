import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, YearCalendar, MonthCalendar } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br'; // Import Portuguese locale data
import ModalDiv from './ModalDiv';

dayjs.locale(ptBr); // Set the locale

export default function ComptPicker({ referenceDate }) {
  return (
    <ModalDiv openModalTitle={'Competência'} description="Selecione a competência" fontColor={'white'}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <hr />
        <MonthCalendar
          referenceDate={referenceDate}
        />
        <hr />
        <YearCalendar

          yearsPerRow={3}
          sx={{
            // gap: 2,
            // width: 100
            borderRadius: 2,
            height: 250,

          }}
          referenceDate={referenceDate}
        />
        <hr />
      </LocalizationProvider>
    </ModalDiv>
  );
}
