import React from 'react'
import styles from './clients.module.css'
import useFetch from '../../hooks/useFetch';


const callbackfn = (data) => {
  // console.log(data)
  const jsxElements = Object.entries(data).map(([key, value]) => (
    <div key={key} className={styles.inputContainer}>
      <label htmlFor={key}>{key}</label>
      {key === 'id' ? (
        <input type="text" id={key} defaultValue={value} disabled />
      ) : (
        <input type="text" id={key} defaultValue={value} />
      )}
    </div>
  ));
  return jsxElements;
}


export default function ClientsPage() {
  // const clientsCompt = Array.from(useFetch('clients_compt'));
  const Empresas = Array.from(useFetch('cadastro_empresas'));

  const jsxElements = Empresas.map((clientData, index) => (
    <div key={index} className={styles.clientContainer}>
      {callbackfn(clientData)}
      <br></br>
    </div>
  ));

  return (
    <div>{jsxElements}</div>
  );
}