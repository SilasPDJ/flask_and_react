import React, { useState } from 'react'
import styles from './competencias.module.css'

// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithPathParams from '../layout/Form/hooks/useFetchWitPathParams';
import MultiForm from '../layout/Form/MultiForm';
// import useFetchQuery from '../layout/Form/hooks/sql/useFetchQuery';
// import getSortedDataBasedOnArray from '../helpers/getSortedDataBasedOnArray';
import ComptPicker from '../layout/ComptPicker';
import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br';
dayjs.locale(ptBr); // Set the locale


export default function CompetenciasPage() {
  // const [datasByParameter, setDatasByParameter] = useFetch('cadastro_competencias');

  // sendingData('cadastro_competencias', { compt: '02-2023' })
  const urlUpdate = 'update_competencias'

  const [competenciaStr, setCompetenciaStr] = useState('2023-07-01')
  const [comptData, comptSetData] = useFetchWithPathParams('cadastro_competencias', competenciaStr);

  const razaoSocialData = comptData.map(element => element['razao_social']);
  const ignoredKeys = ['razao_social']
  // const [startDate, setStartDate] = useState(new Date());

  const getCompetenciaStr = () => {
    const compt = dayjs(competenciaStr)
    const formattedDate = compt.format('MMMM/YYYY');

    return formattedDate;
  };

  const onMonthChange = (compt) => {
    console.log()
    const newCompt = compt.format('YYYY-MM-01');
    console.log(newCompt)
    setCompetenciaStr(newCompt)
  };

  const onYearChange = (compt) => {
    const newCompt = compt.format('YYYY-MM-01');
    setCompetenciaStr(newCompt)
  };


  return (
    <>
      <div id={styles.comptDiv}>
        <div className={styles.leftContainer}>
          <p>Competência Selecionada: <span className={styles.competencia}>{getCompetenciaStr()}</span></p>
        </div>
        <div className={styles.rightContainer}>
          <ComptPicker
            handleMonthChange={onMonthChange}
            handleYearChange={onYearChange}
            referensceDate={dayjs(competenciaStr)}
            openModalButtonId={'selectComptBt'}
          />
        </div>

      </div>
      <MultiForm formDataArray={comptData} setFormDataArray={comptSetData} ignoredKeysArray={ignoredKeys} titleArray={razaoSocialData} apiUrlPostUpdate={urlUpdate} />
      {/* Necessário mudar para enviar */}
    </>
  )
}
