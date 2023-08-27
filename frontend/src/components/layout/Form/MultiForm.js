import React, { useCallback, useState } from 'react';
import styles from "./MultiForm.module.css";
import useFetch from './hooks/useFetch';
import { Button } from '@mui/material';
// import useFetchWithPathParams from './hooks/useFetchWitPathParams';


export default function MultiForm({ formDataArray, setFormDataArray, titleArray }) {
  // console.log(tittleArray)

  const handleInputChange = useCallback((objectIndex, key, value) => {
    setFormDataArray(prevFormDataArray => {
      const updatedFormDataArray = [...prevFormDataArray];
      updatedFormDataArray[objectIndex][key] = value;
      return updatedFormDataArray;
    });
  }, []);

  const renderInputs = (object, objectIndex) => {
    return (
      <div key={objectIndex}>
        <h2>{titleArray[objectIndex]}</h2>
        <div className={styles.clientContainer}>
          {Object.keys(object).map(key => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                value={object[key]}
                onChange={e => handleInputChange(objectIndex, key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {formDataArray.map(renderInputs)}
    </div>
  );
}