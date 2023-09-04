import React, { useCallback, useState } from 'react';
import styles from "./MultiForm.module.css";
import useFetchWithPathParams from './hooks/useFetchWitPathParams';

import { Button, Checkbox } from '@mui/material';
// import useFetchWithPathParams from './hooks/useFetchWitPathParams';
import handleDataSubmit from './DataSubmit';

export default function MultiForm({ formDataArray, setFormDataArray, ignoredKeysArray, getPropertiesFrom, titleArray, apiUrlPostUpdate }) {
  const ignoredKeys = ignoredKeysArray || [''];
  const [mainInputsProperties, setMainInputsProperties] = useFetchWithPathParams('inputs_properties', getPropertiesFrom)

  // console.log(inputsProperties)


  const filterWithoutId = (t) => !(t.id.includes('_id') || t.id.includes('id_'));

  // const [dataFieldsProperties, setDataFeildsProperties] = useFetch(`${urlGetData}/fields_properties`)
  // fields properties

  // Handlers  ----------
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

      // Submit Data
      return updatedFormDataArray;
    });
  }, []);
  const handleInputBlur = (objectIndex) => {
    const responseData = handleDataSubmit(apiUrlPostUpdate, formDataArray[objectIndex]);
    // console.log(responseData);

  }


  const handleCheckboxChange = useCallback((objectIndex, key, checked) => {
    setFormDataArray(prevFormDataArray => {
      const updatedFormDataArray = [...prevFormDataArray];

      updatedFormDataArray[objectIndex][key] = checked;

      // Submit Data
      const responseData = handleDataSubmit(apiUrlPostUpdate, updatedFormDataArray[objectIndex]);
      console.log(responseData);

      return updatedFormDataArray;
    });
  }, []);

  const handleLabelClick = (event) => {
    const input = event.target.nextElementSibling;
    const previousDisabledState = input.disabled
    input.disabled = !previousDisabledState;
    input.select();
    navigator.clipboard.writeText(input.value);
    // document.execCommand('copy');
    input.disabled = previousDisabledState;
  };

  // -----

  const renderInputs = (object, objectIndex) => {
    const index = objectIndex;
    const getDivFormName = (name) => `form-client-${name}`;
    const getInputId = (id, key) => `${id}_${key}`;

    const findInputPlusLabelProperties = (key) => mainInputsProperties.find(objeto => objeto.input.id == key);

    const getInputProperties = (properties) => {
      if (!properties) {
        // id + main_empresa_id
        return {
          "input": {
            "maxlength": "255",
            "type": "text"
          }
        }
      }
      return properties.input;


    }

    // let input_type = getInputType(value);

    return (
      <div id={getDivFormName(index)} key={index} className={styles.clientColumn}>
        <form
          // onSubmit={(e) => handleSubmit(e, index)} 
          method='POST'>
          <div className={styles.clientTitle}>
            <span>{titleArray[objectIndex]}</span>
          </div>
          <div className={styles.checkboxForm}>
            {Object.keys(object).filter(key => !ignoredKeys.includes(key))
              .filter(key => typeof object[key] === 'boolean')
              .map(key => {
                // const properties = findInputPlusLabelProperties(key);
                // const inputsProperties = getInputProperties(properties);

                // console.log(inputsProperties)
                return <div key={key}>
                  <Checkbox
                    checked={formDataArray[index][key]}
                    inputProps={{
                      'id': getInputId(object['id'], key),
                      'name': getInputId(object['id'], key),
                      'disabled': true,
                    }}
                    color='success'
                    onChange={(event) => handleCheckboxChange(index, key, event.target.checked)}
                  />

                  <label htmlFor={getInputId(object['id'], key)}>
                    {key}
                  </label>
                </div>
              })}
          </div>
          <Button variant="contained" color="success" onClick={(event) => handlerAtivarEdicao(getDivFormName(index), event)}>
            Allow Edition
          </Button>

          {Object.keys(object).filter(key => !ignoredKeys.includes(key))
            .filter(key => typeof object[key] !== 'boolean')
            .map(key => {
              const properties = findInputPlusLabelProperties(key);
              const inputsProperties = getInputProperties(properties);
              // console.log(inputsProperties)

              return <div key={key} className={styles.inputsContainer}>
                <label onClick={handleLabelClick} htmlFor={getInputId(object['id'], key)}>
                  {key}
                </label>
                <input
                  type={inputsProperties.type}
                  id={getInputId(object['id'], key)}
                  name={getInputId(object['id'], key)}
                  value={object[key]}
                  maxLength={inputsProperties.maxlength}
                  onChange={e => handleInputChange(objectIndex, key, e.target.value)}
                  onBlur={e => handleInputBlur(objectIndex)}
                  disabled={true}
                />
              </div>
            })}

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