import React, { useState, useEffect } from 'react';
import styles from './Form.module.css';
import CheckboxComponent from './Checkbox';
import handleDataSubmit from './DataSubmit';
import useFetch from './hooks/useFetch';
import { Button } from '@mui/material';

const getInputType = (value) => {
  if (typeof value === 'boolean') {
    return 'checkbox';
  }
  return 'text';
};


export default function Form({ data, setData, urlGetData, apiUrlPostUpdate }) {
  /**
   * Dynamic form component to display and update company data.
   *
   * @param {string} urlGetData - The API URL for [GET] fetching company data.
   * @param {string} apiUrlPostUpdate - The API URL for [POST] sending updated company data.
   * @returns {JSX.Element} Form component.
   */

  // const [datasByParameter, setDatasByParameter] = useFetch(urlGetData);
  const [datasByParameter, setDatasByParameter] = [data, setData]
  // TODO improve this part
  const [dataFieldsProperties, setDataFeildsProperties] = useFetch(`${urlGetData}/fields_properties`)

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

  const handleLabelClick = (event) => {
    const input = event.target.nextElementSibling;
    const previousDisabledState = input.disabled
    input.disabled = false;
    input.select();
    document.execCommand('copy');
    input.disabled = previousDisabledState;
  };


  const handleInputChange = (clientIndex, key, value) => {
    const updatedClients = [...datasByParameter];
    const updatedClient = { ...updatedClients[clientIndex] };

    updatedClient[key] = value;

    updatedClients[clientIndex] = updatedClient;

    setDatasByParameter(updatedClients);

    const responseData = handleDataSubmit(apiUrlPostUpdate, updatedClient);
  };

  // Setting Empresas Inputs
  const showInputs = (clientData, clientIndex) => {
    const checkBoxInputs = Object.keys(clientData)
      .filter(key => getInputType(clientData[key]) === 'checkbox')
      .reduce((result, key) => {
        result[key] = clientData[key];
        return result;
      }, {});

    // Filtering otherInputs and ordering them
    const otherInputs = Object.keys(clientData)
      .filter(key => !checkBoxInputs.hasOwnProperty(key))
      .sort((a, b) => {
        const includesIdA = a.includes('_id') || a.includes('id_') || a == 'id';
        const includesIdB = b.includes('_id') || b.includes('id_') || b == 'id';

        if (includesIdA && !includesIdB) {
          return 1; // 'a' should come after 'b'
        } else if (!includesIdA && includesIdB) {
          return -1; // 'a' should come before 'b'
        } else {
          return 0; // Maintain the original order
        }
      })
      .reduce((result, key) => {
        result[key] = clientData[key];
        return result;
      }, {});
    // console.log(otherInputs)

    const htmlOtherInputs = Object.entries(otherInputs).map(([key, value], indx) => {
      let input_id = `${clientData['id']}_${key}`;
      let input_type = getInputType(value);

      // TODO: check this part

      let inputsMaxLength
      try {
        inputsMaxLength = dataFieldsProperties['inputs_max_length'][indx]
      }
      catch {
        inputsMaxLength = 255
      }
      // console.log(inputsMaxLength)

      return (
        <div className={styles.inputsForm} key={input_id}>
          {/* Todo: remover o onclick do input_type checkbox */}
          <label onClick={handleLabelClick} htmlFor={input_id}>
            {key}
          </label>

          <input
            type={input_type}
            id={input_id}
            name={input_id}
            value={clientData[key]}
            onChange={(e) => handleInputChange(clientIndex, key, e.target.value)}
            // onBlur={(e) => handleInputBlur(clientIndex, key, e.target.value)}
            // disabled={key !== 'id'}
            disabled={true}
            maxLength={inputsMaxLength !== -1 ? inputsMaxLength : undefined}
          // Na minha lógica, inputs sem essa propriedade, recebem -1 
          />

        </div>
      );
    });

    // 
    const htmlCheckbox = Object.entries(checkBoxInputs).map(([key, value], indx) => {
      let input_id = `${clientData['id']}_${key}`;
      let input_type = getInputType(value);

      return (
        <div className={styles.checkboxesForm} key={input_id}>
          {/* Todo: remover o onclick do input_type checkbox */}
          <label onClick={handleLabelClick} htmlFor={input_id}>
            {key}
          </label>
          <CheckboxComponent
            id={key}
            // onChange={(e) => handleInputBlur(clientIndex, key, e.target.value)}
            defaultValue={value}
            clabel="STATUS ATIVO" />
        </div>
      )
    })

    return (
      <div className={styles.inputsContainer}>
        {htmlCheckbox}
        {htmlOtherInputs}
      </div>
    )
  };

  let getDivFormName = (name) => `form-client-${name}`;

  // Component
  return (
    <div className={styles.clientContainer}>
      {datasByParameter.map((clientData, index) => (
        <div id={getDivFormName(index)} key={index} className={styles.clientColumn}>
          <form
            // onSubmit={(e) => handleSubmit(e, index)} 
            method='POST'>
            <Button variant="contained" color="success" onClick={(event) => handlerAtivarEdicao(getDivFormName(index), event)}>
              Allow Edition
            </Button>
            {showInputs(clientData, index)}
            {/* Call the arg function after creating the inputs */}
          </form>
        </div>
      ))}
    </div>
  );
}
