import React from 'react';
import styles from './clients.module.css';
import useFetch from '../../hooks/useFetch';


// Copy input's value
const handleLabelClick = (event) => {
  const input = event.target.nextElementSibling;
  input.select();
  document.execCommand('copy');
};


const showEmpresasInputs = (data) => {
  // create the inputs callback
  const jsxElements = Object.entries(data).map(([key, value]) => {
    let input_id = `${data['id']}_${key}`
    return <div key={key} className={styles.inputContainer}>
      <label onClick={handleLabelClick} htmlFor={input_id}>{key}</label>
      {key === 'id' ? (
        <input type="text" id={input_id} defaultValue={value} disabled />
      ) : (
        <input type="text" id={input_id} defaultValue={value} />
      )}
    </div>
  });
  return jsxElements;
}

export default function ClientsPage() {
  const Empresas = Array.from(useFetch('cadastro_empresas'));

  const jsxElements = Empresas.map((clientData, index) => (
    <div>
      <div key={index} className={styles.clientColumn}>
        {showEmpresasInputs(clientData)}
      </div>
      <hr />
    </div>
  ));

  return (
    <div className={styles.clientContainer}>{jsxElements}</div>
  );
}
