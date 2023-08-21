import React from 'react';
import styles from './clients.module.css';
import useFetch from '../../hooks/useFetch';

const callbackfn = (data) => {

  const jsxElements = Object.entries(data).map(([key, value]) => {
    let input_id = `${data['id']}_${key}`
    return <div key={key} className={styles.inputContainer}>
      <label htmlFor={input_id}>{key}</label>
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
        {callbackfn(clientData)}
      </div>
      <hr />
    </div>
  ));

  return (
    <div className={styles.clientContainer}>{jsxElements}</div>
  );
}
