import React from 'react'
import styles from './competencias.module.css'
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';
import sendingData from '../layout/Form/helpers/postData';
// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithPathParams from '../layout/Form/hooks/useFetchWitPathParams';
import MultiForm from '../layout/Form/TryingWithStress';
import useFetchSql from '../layout/Form/hooks/sql/useFetchSql';
import getSortedDataBasedOnArray from '../helpers/getSortedDataBasedOnArray';

export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })


  const [comptData, comptSetData] = useFetchWithPathParams('cadastro_competencias', '2023-07-01')
  const idArray = comptData.map(element => element['main_empresa_id']);

  const [ArrayRazaoSocialwithID, _] = useFetchSql('select', 'SELECT ID, RAZAO_SOCIAL FROM main_empresas')

  const razaoSocialData = getSortedDataBasedOnArray(ArrayRazaoSocialwithID, idArray, 'RAZAO_SOCIAL')

  console.log(razaoSocialData)
  // const razaoSocialArray = razaoSocialData.map(id => razaoSocialData[id].RAZAO_SOCIAL);


  // Sort the data array based on the order of IDs in idArray


  return (
    <>
      competencias page
      {/* <Form
        data={comptData}
        setData={comptSetData}
        urlGetData="cadastro_competencias"
        apiUrlPostUpdate="empresasdsadas">
      </Form> */}

      <MultiForm formDataArray={comptData} setFormDataArray={comptSetData} titleArray={razaoSocialData} />
      {/* Necessário mudar para enviar */}
    </>
  )
}
