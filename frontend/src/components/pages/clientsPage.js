import React, { useState, useEffect } from 'react';
import styles from './clients.module.css';
import useFetch from '../layout/Form/hooks/useFetch';
import Form from '../layout/Form/Form';
import { Button } from '@mui/material';



export default function ClientsPage() {
  // Setting Datas 
  const empresasData = useFetch('cadastro_empresas');

  return (
    <>
      <div className='absolute'><Button variant='contained'>Criar Novo Cliente</Button></div>

      <Form urlGetData="cadastro_empresas" apiUrlPostUpdate="empresas" />
    </>
  )

}

// TODO: melhorar a forma de utilizar os componentes pra ficar mais reutilizável