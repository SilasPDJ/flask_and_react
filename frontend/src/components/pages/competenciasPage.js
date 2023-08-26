import React from 'react'
import styles from './competencias.module.css'
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';
import sendingData from '../layout/Form/helpers/postData';
// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithParams from '../layout/Form/hooks/useFetchWitPathParams';
import MultiForm from '../layout/Form/TryingWithStress';

export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })


  const [comptData, comptSetData] = useFetchWithParams('cadastro_competencias', '2023-07-01')
  // const [test, setTest] = useFetchWithParams

  const tittleArray = comptData.map(element => element['main_empresa_id']);

  return (
    <>
      competencias page
      {/* <Form
        data={comptData}
        setData={comptSetData}
        urlGetData="cadastro_competencias"
        apiUrlPostUpdate="empresasdsadas">
      </Form> */}

      <MultiForm formDataArray={comptData} setFormDataArray={comptSetData} tittleArray={tittleArray} />
      {/* Necessário mudar para enviar */}
    </>
  )
}
