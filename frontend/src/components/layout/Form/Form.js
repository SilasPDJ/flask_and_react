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
   * Componente de formulário dinâmico para exibir e atualizar dados de empresas.
   *
   * @param {string} urlGetData - A URL da API para [GET] buscar os dados das empresas.
   * @param {string} apiUrlPostUpdate - A URL da API para [POST] enviar os dados atualizados das empresas.
   * @returns {JSX.Element} Componente de formulário.
   */

  const [dadosPorParametro, setDadosPorParametro] = useFetch(urlGetData);
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
      buttonCaller.textContent = 'EDITAR'

    } else {
      buttonCaller.textContent = 'PROTEGER'
    }

  };

  const handleLabelClick = (event) => {
    const input = event.target.nextElementSibling;
    input.disabled = false;
    input.select();
    document.execCommand('copy');
    input.disabled = true;
  };


  const handleInputChange = (clientIndex, key, value) => {
    setDadosPorParametro((prevClientes) => {
      const newClientes = [...prevClientes];
      newClientes[clientIndex][key] = value;
      return newClientes;
    });
    // const responseData = handleDataSubmit(apiUrlPostUpdate, dadosPorParametro[clientIndex]);

  };

  const handleSubmit = async (e, clientIndex) => {
    const responseData = await handleDataSubmit(apiUrlPostUpdate, dadosPorParametro[clientIndex]);
    e.preventDefault();

    console.log('Response:', responseData);
  };

  // Setting Empresas Inputs
  const showInputs = (clientData, clientIndex) => {
    return Object.entries(clientData).map(([key, value], indx) => {
      let input_id = `${clientData['id']}_${key}`;
      let input_type = getInputType(value);
      let inputsMaxLength = dataFieldsProperties['inputs_max_length'][indx]
      // console.log(inputsMaxLength)

      return (
        <div className={styles.inputsContainer} key={input_id}>
          {/* Todo: remover o onclick do input_type checkbox */}
          <label onClick={handleLabelClick} htmlFor={input_id}>
            {key}
          </label>
          {input_type === 'checkbox' ? (
            <CheckboxComponent id={key} defaultValue={value} label="STATUS ATIVO" />
          ) : (
            <input
              type={input_type}
              id={input_id}
              name={input_id}
              value={dadosPorParametro[clientIndex][key] || ''}
              onChange={(e) => handleInputChange(clientIndex, key, e.target.value)}
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
      {dadosPorParametro.map((clientData, index) => (
        <div id={getDivFormName(index)} key={index} className={styles.clientColumn}>
          <form onSubmit={(e) => handleSubmit(e, index)} method='POST'>
            <Button variant="contained" color="success" onClick={(event) => handlerAtivarEdicao(getDivFormName(index), event)}>
              EDITAR
              {/* TODO: mudar de success p/ warning com usestate? */}
            </Button>
            {showInputs(clientData, index)}
            {/* <input type="submit" value="Enviar" /> */}
          </form>
        </div>
      ))}
    </div>
  );
}
