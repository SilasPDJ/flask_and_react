import React, { useState, useEffect } from 'react';
import styles from './clients.module.css';
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';



export default function ClientsPage() {
  // Setting Datas 
  const urlData = 'cadastro_empresas'
  const [datasByParameter, setDatasByParameter] = useFetch(urlData)
  console.log(datasByParameter)


  return (
    <>
      <div className='absolute'><Button variant='contained'>Criar Novo Cliente</Button></div>

      <Form data={datasByParameter} setData={setDatasByParameter} urlGetData={urlData} apiUrlPostUpdate="empresas" />
    </>
  )

}

// TODO: melhorar a forma de utilizar os componentes pra ficar mais reutilizável