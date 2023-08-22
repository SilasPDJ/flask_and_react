import React, { useState, useEffect } from 'react';
import styles from './clients.module.css';
import useFetch from '../../hooks/useFetch';
import CheckboxComponent from '../layout/Checkbox';
import handleDataSubmit from '../handlers/DataSubmit';

const getInputType = (value) => {
  if (typeof value === 'boolean') {
    return 'checkbox';
  }
  return 'text';
};

export default function ClientsPage() {
  // Setting Datas 
  const empresasData = useFetch('cadastro_empresas');
  const [clientes, setClientes] = useState(empresasData);

  useEffect(() => {
    setClientes(empresasData);
  }, [empresasData]);


  // Handlers 
  const handleLabelClick = (event) => {
    const input = event.target.nextElementSibling;
    input.select();
    document.execCommand('copy');
  };

  const handleInputChange = (clientIndex, key, value) => {
    setClientes((prevClientes) => {
      const newClientes = [...prevClientes];
      newClientes[clientIndex][key] = value;
      return newClientes;
    });
  };

  const handleSubmit = async (e, clientIndex) => {
    e.preventDefault();

    const responseData = await handleDataSubmit('empresas', clientes[clientIndex]);
    console.log('Response:', responseData);
  };

  // Setting Empresas Inputs
  const showEmpresasInputs = (clientData, clientIndex) => {
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
              value={clientes[clientIndex][key] || ''}
              onChange={(e) => handleInputChange(clientIndex, key, e.target.value)}
              disabled={key === 'id'}
            />
          )}
        </div>
      );
    });
  };

  // Component
  return (
    <div className={styles.clientContainer}>
      {clientes.map((clientData, index) => (
        <div key={index} className={styles.clientColumn}>
          <form onSubmit={(e) => handleSubmit(e, index)} method='POST'>
            {showEmpresasInputs(clientData, index)}
            <input type="submit" value="Enviar" />
          </form>
        </div>
      ))}
    </div>
  );
}
