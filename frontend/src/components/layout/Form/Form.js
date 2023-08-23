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


export default function Form({ urlGetData, apiUrlPostUpdate }) {
  /**
   * Dynamic form component to display and update company data.
   *
   * @param {string} urlGetData - The API URL for [GET] fetching company data.
   * @param {string} apiUrlPostUpdate - The API URL for [POST] sending updated company data.
   * @returns {JSX.Element} Form component.
   */

  const [datasByParameter, setDatasByParameter] = useFetch(urlGetData);
  const [dataFieldsProperties, setDataFeildsProperties] = useFetch(`${urlGetData}/fields_properties`)


  // Handlers 
  const handlerAtivarEdicao = (divId, event) => {
    let buttonCaller = event.target

    let divForm = document.getElementById(divId)
    let _inputs = divForm.querySelectorAll('input')
    // Use slice to ignore the first input
    const inputsToToggle = Array.from(_inputs).slice(1);

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

  /*const handleSubmit = async (e, clientIndex) => {
    const responseData = await handleDataSubmit(apiUrlPostUpdate, dadosPorParametro[clientIndex]);
    e.preventDefault();

    console.log('Response:', responseData);
  };*/

  // Setting Empresas Inputs
  const showInputs = (clientData, clientIndex) => {
    return Object.entries(clientData).map(([key, value], indx) => {
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
        <div className={styles.inputsContainer} key={input_id}>
          {/* Todo: remover o onclick do input_type checkbox */}
          <label onClick={handleLabelClick} htmlFor={input_id}>
            {key}
          </label>
          {input_type === 'checkbox' ? (
            <CheckboxComponent
              id={key}
              // onChange={(e) => handleInputBlur(clientIndex, key, e.target.value)}
              defaultValue={value}
              clabel="STATUS ATIVO" />
          ) : (
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
          )}
        </div>
      );
    });
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
            {/* <input type="submit" value="Enviar" /> */}
          </form>
        </div>
      ))}
    </div>
  );
}
