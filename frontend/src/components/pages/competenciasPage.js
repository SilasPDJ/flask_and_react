import React from 'react'
import styles from './competencias.module.css'
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';
import sendingData from '../layout/Form/helpers/postData';
// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithParams from '../layout/Form/hooks/useFetchWitParams';

export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })
  const [comptData, comptSetData] = useFetchWithParams('cadastro_competencias', '2023-07-01')
  console.log(comptData)
  console.log('hi')
  return (
    <>
      competencias page
      <Form data={comptData} setData={comptSetData} urlGetData="cadastro_competencias" apiUrlPostUpdate="empresas"></Form>
      {/* Necessário mudar para enviar */}
    </>
  )
}
