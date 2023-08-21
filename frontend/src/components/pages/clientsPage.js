import React from 'react';
import styles from './clients.module.css';
import useFetch from '../../hooks/useFetch';
import CheckboxComponent from '../layout/Checkbox';

// Copy input's value
const handleLabelClick = (event) => {
  const input = event.target.nextElementSibling;
  input.select();
  document.execCommand('copy');
};


const getInputType = (value) => {
  if (typeof (value) == 'boolean') {
    return 'checkbox'
  }
  return 'text'

}


const showEmpresasInputs = (data) => {
  // create the inputs callback
  const jsxElements = Object.entries(data).map(([key, value]) => {
    let input_id = `${data['id']}_${key}`
    let input_type = getInputType(value)
    return (
      <div className={styles.inputsContainer} key={input_id}>
        <label onClick={handleLabelClick} htmlFor={input_id}>{key}</label>
        {input_type === 'checkbox' ? (
          <CheckboxComponent id={key} defaultValue={value} label="STATUS ATIVO" />
        ) : (
          <input
            type={input_type}
            id={input_id}
            name={input_id}
            defaultValue={value}
            disabled={key === 'id'}
          />
        )
        }
      </div>
    );
  });
  return jsxElements;
}

export default function ClientsPage() {
  const Empresas = Array.from(useFetch('cadastro_empresas'));

  const jsxElements = Empresas.map((clientData, index) => (
    <form key={index} className={styles.clientColumn}>
      {showEmpresasInputs(clientData)}

      <input type="submit" value="Enviar" />
    </form>
  ));

  return (
    <div className={styles.clientContainer}>
      {jsxElements}
    </div>
  );
}
