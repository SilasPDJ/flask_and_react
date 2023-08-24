import React from 'react'
import styles from './competencias.module.css'
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';
import sendingData from '../layout/Form/hooks/postData';
// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import getDataWithPathParameters from '../layout/Form/hooks/getDataWithPathParams';

export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })
  const comptData = getDataWithPathParameters('cadastro_competencias', '2023-07-01')
  console.log(comptData)
  console.log('hi')
  return (
    <>
      competencias page
    </>
  )
}
