import React, { useState } from 'react'
import styles from './competencias.module.css'

// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithPathParams from '../layout/Form/hooks/useFetchWitPathParams';
import MultiForm from '../layout/Form/MultiForm';
// import useFetchQuery from '../layout/Form/hooks/sql/useFetchQuery';
// import getSortedDataBasedOnArray from '../helpers/getSortedDataBasedOnArray';
import ComptPicker from '../layout/ComptPicker';
import dayjs from 'dayjs';


export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })
  const urlUpdate = 'update_competencias'
  // TODO settar a competencia automaticamente 

  const [comptData, comptSetData] = useFetchWithPathParams('cadastro_competencias', '2023-07-01');

  const razaoSocialData = comptData.map(element => element['razao_social']);
  const ignoredKeys = ['razao_social']
  // const [startDate, setStartDate] = useState(new Date());

  return (
    <>
      <div id={styles.comptDiv}>

        <ComptPicker referenceDate={dayjs(new Date(2023, 0, 1))} />

      </div>
      <MultiForm formDataArray={comptData} setFormDataArray={comptSetData} ignoredKeysArray={ignoredKeys} titleArray={razaoSocialData} apiUrlPostUpdate={urlUpdate} />
      {/* Necessário mudar para enviar */}
    </>
  )
}
