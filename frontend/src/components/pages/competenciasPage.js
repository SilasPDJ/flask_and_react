import React, { useEffect } from 'react'
import styles from './competencias.module.css'
import useFetch from '../layout/Form/hooks/useFetch';
import { Button } from '@mui/material';
import sendingData from '../layout/Form/helpers/postData';
// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithPathParams from '../layout/Form/hooks/useFetchWitPathParams';
import MultiForm from '../layout/Form/MultiForm';
import useFetchQuery from '../layout/Form/hooks/sql/useFetchQuery';
import getSortedDataBasedOnArray from '../helpers/getSortedDataBasedOnArray';

export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })
  const urlUpdate = 'update_competencias'


  const [comptData, comptSetData] = useFetchWithPathParams('cadastro_competencias', '2023-07-01');

  const razaoSocialData = comptData.map(element => element['razao_social']);
  const ignoredKeys = ['razao_social']

  return (
    <>
      competencias page
      {/* <Form
        data={comptData}
        setData={comptSetData}
        urlGetData="cadastro_competencias"
        apiUrlPostUpdate="empresasdsadas">
      </Form> */}

      <MultiForm formDataArray={comptData} setFormDataArray={comptSetData} ignoredKeysArray={ignoredKeys} titleArray={razaoSocialData} apiUrlPostUpdate={urlUpdate} />
      {/* Necessário mudar para enviar */}
    </>
  )
}
