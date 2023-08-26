import React, { useCallback, useState } from 'react';
import { FixedSizeList } from 'react-window';
import useFetchWithParams from './hooks/useFetchWitPathParams';



export default function MultiForm({ formDataArray, setFormDataArray, tittleArray }) {
  console.log(tittleArray)

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
        <h2>{tittleArray[objectIndex]}</h2>
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
    );
  };

  return (
    <div>
      {formDataArray.map(renderInputs)}
    </div>
  );
}