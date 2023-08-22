import React, { useState, useEffect } from 'react';
import styles from './Form.module.css';
import CheckboxComponent from './Checkbox';
import handleDataSubmit from './DataSubmit';
import useFetch from './hooks/useFetch';


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
  const handleLabelClick = (event) => {
    const input = event.target.nextElementSibling;
    input.select();
    document.execCommand('copy');
  };

  const handleInputChange = (clientIndex, key, value) => {
    setDadosPorParametro((prevClientes) => {
      const newClientes = [...prevClientes];
      newClientes[clientIndex][key] = value;
      return newClientes;
    });
  };

  const handleSubmit = async (e, clientIndex) => {
    e.preventDefault();

    const responseData = await handleDataSubmit(apiUrlPostUpdate, dadosPorParametro[clientIndex]);
    console.log('Response:', responseData);
  };

  // Setting Empresas Inputs
  const showInputs = (clientData, clientIndex) => {
    return Object.entries(clientData).map(([key, value]) => {
      let input_id = `${clientData['id']}_${key}`;
      let input_type = getInputType(value);

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
              disabled={key === 'id'}
              maxLength={10}
            />
          )}
        </div>
      );
    });
  };

  // Component
  return (
    <div className={styles.clientContainer}>
      {dadosPorParametro.map((clientData, index) => (
        <div key={index} className={styles.clientColumn}>
          <form onSubmit={(e) => handleSubmit(e, index)} method='POST'>
            {showInputs(clientData, index)}
            <input type="submit" value="Enviar" />
          </form>
        </div>
      ))}
    </div>
  );
}
