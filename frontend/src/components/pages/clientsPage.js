import React, { useState, useEffect } from 'react';
import styles from './clients.module.css';
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';
import MultiForm from '../layout/Form/MultiForm';
import useFetchQuery from '../layout/Form/hooks/sql/useFetchQuery';
import getSortedDataBasedOnArray from '../helpers/getSortedDataBasedOnArray';


export default function ClientsPage() {
  // Setting Datas 
  const urlData = 'cadastro_empresas'
  const [empresasData, setEmpresasData] = useFetch(urlData)

  // THIS ALLOWS only SELECT
  const razaoSocialData = empresasData.map((d) => d.razao_social)
  // const [dataFieldsProperties, setDataFeildsProperties] = useFetch(`${urlGetData}/fields_properties`)

  return (
    <>
      <div className='absolute'><Button variant='contained'>Criar Novo Cliente</Button></div>

      <MultiForm formDataArray={empresasData} setFormDataArray={setEmpresasData} titleArray={razaoSocialData} />
    </>
  )

}

// TODO: melhorar a forma de utilizar os componentes pra ficar mais reutilizável