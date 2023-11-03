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

  const [competenciaStr, setCompetenciaStr] = useState('2023-09-01')
  const [comptData, comptSetData] = useFetchWithPathParams('cadastro_competencias', competenciaStr);
  const ignoredKeys = ['razao_social',
    // 'main_empresa_id'
  ]
  // const [startDate, setStartDate] = useState(new Date());
  // TODO... data da competencia no useState setCompetenciaStr?
  // TODO... trocar para quando clicar no label, copiar o label, e no input, copiar ao valor do input
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

  const [itemsPerPage, setItemsPerPage] = useState(40);
  const [categoriaImposto, setCategoriaImposto] = useState('ALL');

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
            label={"Categoria Cliente"}
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
              console.log(e ? e : "ALL")
              setCategoriaImposto(e ? e : "ALL")
            }}

          />
        </div>

      </div>
      <MultiForm
        formDataArray={comptData}
        setFormDataArray={comptSetData}
        categoryFilter={categoriaImposto}
        ignoredKeysArray={ignoredKeys}
        formDataTitleKey={'razao_social'}
        apiUrlPostUpdate={urlUpdate}
        getPropertiesFrom={'competencias'}
        itemsPerPage={itemsPerPage}
      />
    </>
  )
}
