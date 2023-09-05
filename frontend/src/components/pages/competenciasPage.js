import React, { useState } from 'react'
import styles from './competencias.module.css'

// import getDataWithQueryParameters from '../layout/Form/hooks/getDataWithQueryParams';
import useFetchWithPathParams from '../layout/Form/hooks/useFetchWitPathParams';
import useFetch from "../layout/Form/hooks/useFetch";
import MultiForm from '../layout/Form/MultiForm';
import SelectMui from '../layout/Form/SelectMui';
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
  // TODO continuar daqui
  const razaoSocialData = comptData.map(element => element['razao_social']);
  const ignoredKeys = ['razao_social']
  // const [startDate, setStartDate] = useState(new Date());
  // TODO... data da competencia no useState setCompetenciaStr?
  const getCompetenciaStr = () => {
    const compt = dayjs(competenciaStr)
    const formattedDate = compt.format('MMMM/YYYY');

    return formattedDate;
  };

  const onMonthChange = (compt) => {
    const newCompt = compt.format('YYYY-MM-01');
    console.log(newCompt)
    setCompetenciaStr(newCompt)
  };

  const onYearChange = (compt) => {
    const newCompt = compt.format('YYYY-MM-01');
    setCompetenciaStr(newCompt)
  };

  const [itemsPerPage, setItemsPerPage] = useState(12);

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
            referenceDate={dayjs(competenciaStr)}
            openModalButtonId={'selectComptBt'}
          />

          <SelectMui
            objects={
              {
                "TODOS IMPOSTOS": "ALL",
                "ISS": "ISS",
                "ICMS": "ICMS",
                "SEM MOV": "SEM_MOV",
                "LP": "LP",
              }
            }
            onChange={(e) => {
              console.log(e)
            }}

          />
        </div>

      </div>
      <MultiForm
        formDataArray={comptData}
        setFormDataArray={comptSetData}
        ignoredKeysArray={ignoredKeys}
        titleArray={razaoSocialData}
        apiUrlPostUpdate={urlUpdate}
        getPropertiesFrom={'competencias'}
        itemsPerPage={itemsPerPage}
      />
      {/* <div className={styles.formContainer} dangerouslySetInnerHTML={{ __html: test['html'] }}></div> */}
      {/* Necessário mudar para enviar */}
    </>
  )
}
