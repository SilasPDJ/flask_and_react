import React, { useCallback, useState } from 'react';
import styles from "./MultiForm.module.css";
import useFetch from './hooks/useFetch';
import { Button } from '@mui/material';
// import useFetchWithPathParams from './hooks/useFetchWitPathParams';


export default function MultiForm({ formDataArray, setFormDataArray, titleArray }) {
  const filterWithoutId = (t) => !(t.id.includes('_id') || t.id.includes('id_'));

  // Handlers 
  const handlerAtivarEdicao = (divId, event) => {
    let buttonCaller = event.target

    let divForm = document.getElementById(divId)
    let _inputs = divForm.querySelectorAll('input')
    // Use slice to ignore the first input
    // const mainInputs = Array.from(_inputs).slice(1);
    const mainInputs = Array.from(_inputs);
    const inputsToToggle = mainInputs.filter(filterWithoutId);

    // console.log(inputsToToggle)
    inputsToToggle.forEach((input) => {
      input.disabled = !input.disabled
    })

    if (inputsToToggle[0].disabled) {
      buttonCaller.textContent = 'ALLOW EDITION'

    } else {
      buttonCaller.textContent = 'PROTECT EDITION'
    }

  };

  const handleInputChange = useCallback((objectIndex, key, value) => {
    setFormDataArray(prevFormDataArray => {
      const updatedFormDataArray = [...prevFormDataArray];
      updatedFormDataArray[objectIndex][key] = value;
      return updatedFormDataArray;
    });
  }, []);

  const renderInputs = (object, objectIndex) => {
    const index = objectIndex;
    const getDivFormName = (name) => `form-client-${name}`;
    const getInputId = (id, key) => `${id}_${key}`;
    // let input_type = getInputType(value);

    return (
      <div id={getDivFormName(index)} key={index} className={styles.clientColumn}>
        <h4>{titleArray[objectIndex]}</h4>
        <form
          // onSubmit={(e) => handleSubmit(e, index)} 
          method='POST'>
          <Button variant="contained" color="success" onClick={(event) => handlerAtivarEdicao(getDivFormName(index), event)}>
            Allow Edition
          </Button>
          {Object.keys(object).map(key => (
            <div key={key}>
              <label>{key}
                <input
                  type="text"
                  id={getInputId(object['id'], key)}
                  name={getInputId(object['id'], key)}
                  value={object[key]}
                  onChange={e => handleInputChange(objectIndex, key, e.target.value)}
                  disabled={true}
                />
              </label>
            </div>
          ))}
        </form>

      </div>
    );
  };

  return (
    <div className={styles.clientContainer}>
      {formDataArray.map(renderInputs)}
    </div>
  );
}