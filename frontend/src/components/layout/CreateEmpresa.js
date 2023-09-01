import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, YearCalendar, MonthCalendar } from '@mui/x-date-pickers';
import useFetchWithPathParams from './Form/hooks/useFetchWitPathParams';
import useFetch from './Form/hooks/useFetch';

import dayjs from 'dayjs';
import ModalDiv from './ModalDiv';

export default function CreateEmpresa() {
  const [template, setFormRef] = useFetch('sql/insert/new_client')
  return (
    <ModalDiv openModalTitle="CRIAR NOVO CLIENTE" fontColor={'white'}>
      {/* Use the ref to target the HTML element */}
      {/* <div dangerouslySetInnerHTML={{ __html: formRef }}></div> */}
      <form dangerouslySetInnerHTML={{ __html: template['html'] }} />

    </ModalDiv>)
}
