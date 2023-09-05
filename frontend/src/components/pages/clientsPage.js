import React, { useState, useEffect } from 'react';
import styles from './clients.module.css';
import useFetch from '../layout/Form/hooks/useFetch';
import { Button } from '@mui/material';
import MultiForm from '../layout/Form/MultiForm';
import useFetchQuery from '../layout/Form/hooks/sql/useFetchQuery';
import getSortedDataBasedOnArray from '../helpers/getSortedDataBasedOnArray';
import CreateEmpresa from '../layout/CreateEmpresa';

export default function ClientsPage() {
  // Setting Datas 
  const urlData = 'cadastro_empresas'
  const urlUpdate = 'update_empresas'
  const [empresasData, setEmpresasData] = useFetch(urlData)

  // THIS ALLOWS only SELECT
  // const [dataFieldsProperties, setDataFeildsProperties] = useFetch(`${urlGetData}/fields_properties`)

  return (
    <>
      <div className='absolute'>
        {/* <Button variant='contained'>Criar Novo Cliente</Button> */}
        <CreateEmpresa />
      </div>
      <MultiForm
        formDataArray={empresasData}
        setFormDataArray={setEmpresasData}
        formDataTitleKey={'razao_social'}
        apiUrlPostUpdate={urlUpdate}
        itemsPerPage={100}
      />
    </>
  )

}

// TODO: melhorar a forma de utilizar os componentes pra ficar mais reutilizável