import React, { useCallback, useState, useEffect } from 'react';
import styles from './MultiForm.module.css';
import useFetchWithPathParams from './hooks/useFetchWitPathParams';
import { Button, Checkbox } from '@mui/material';
import handleDataSubmit from './DataSubmit';

// TODO: id should not be an input?

export default function MultiForm({ formDataArray, setFormDataArray, categoryFilter, ignoredKeysArray, getPropertiesFrom, formDataTitleKey, apiUrlPostUpdate, itemsPerPage }) {
  const ignoredKeys = ignoredKeysArray || [''];
  const [mainInputsProperties, setMainInputsProperties] = useFetchWithPathParams('inputs_properties', getPropertiesFrom);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    // Calculate the start and end indices for the current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the formDataArray to get the data for the current page
    const currentPageData = formDataArray.slice(startIndex, endIndex).filter((e) => {
      // Include filter for "categoryFilter"
      if (categoryFilter && categoryFilter !== "ALL") {
        return e.imposto_a_calcular === categoryFilter;
      }
      return true; // Include all elements when categoryFilter is not applied
    });
    ;

    setDisplayedData(currentPageData);
  }, [currentPage, formDataArray, itemsPerPage, categoryFilter]);


  const filterWithoutId = (t) => !(t.id.includes('_id') || t.id.includes('id_'));

  const handlerAtivarEdicao = (divId, event) => {
    let buttonCaller = event.target;
    let divForm = document.getElementById(divId);
    let _inputs = divForm.querySelectorAll('input');
    const mainInputs = Array.from(_inputs);
    const inputsToToggle = mainInputs.filter(filterWithoutId);

    inputsToToggle.forEach((input) => {
      input.disabled = !input.disabled;
    });

    if (inputsToToggle[0].disabled) {
      buttonCaller.textContent = 'ALLOW EDITION';
    } else {
      buttonCaller.textContent = 'PROTECT EDITION';
    }
  };

  const handleInputChange = useCallback((objectIndex, key, value) => {
    setFormDataArray((prevFormDataArray) => {
      const updatedFormDataArray = [...prevFormDataArray];
      updatedFormDataArray[objectIndex][key] = value;

      return updatedFormDataArray;
    });
  }, [setFormDataArray]);

  const handleInputBlur = (objectIndex) => {
    const responseData = handleDataSubmit(apiUrlPostUpdate, formDataArray[objectIndex]);
    // console.log(responseData);
  };

  const handleCheckboxChange = useCallback((objectIndex, key, checked) => {
    setFormDataArray((prevFormDataArray) => {
      const updatedFormDataArray = [...prevFormDataArray];
      updatedFormDataArray[objectIndex][key] = checked;

      // Submit Data
      const responseData = handleDataSubmit(apiUrlPostUpdate, updatedFormDataArray[objectIndex]);
      console.log(responseData);

      return updatedFormDataArray;
    });
  }, [setFormDataArray]);

  const handleLabelClick = (event) => {
    const input = event.target.nextElementSibling;
    const previousDisabledState = input.disabled;
    input.disabled = !previousDisabledState;
    input.select();
    navigator.clipboard.writeText(input.value);
    input.disabled = previousDisabledState;
  };

  const renderInputs = (object, objectIndex) => {
    const index = currentPage * itemsPerPage + objectIndex; // Calculate the correct index
    const getDivFormName = (name) => `form-client-${name}`;
    const getInputId = (id, key) => `${id}_${key}`;
    const findInputPlusLabelProperties = (key) => mainInputsProperties.find((objeto) => objeto.input.id === key);

    const getInputProperties = (properties) => {
      if (!properties) {
        return {
          input: {
            maxlength: '255',
            type: 'text',
          },
        };
      }
      return properties.input;
    };

    return (
      <div id={getDivFormName(index)} key={index} className={styles.clientColumn}>
        <form method="POST">
          <div className={styles.clientTitle}>
            <span>{object[formDataTitleKey]}</span>
          </div>
          <div className={styles.checkboxForm}>
            {Object.keys(object)
              .filter((key) => !ignoredKeys.includes(key))
              .filter((key) => typeof object[key] === 'boolean')
              .map((key) => {
                return (
                  <div key={key}>
                    <Checkbox
                      checked={formDataArray[index][key]}
                      inputProps={{
                        id: getInputId(object['id'], key),
                        name: getInputId(object['id'], key),
                        disabled: true,
                      }}
                      color="success"
                      onChange={(event) => handleCheckboxChange(index, key, event.target.checked)}
                    />
                    <label htmlFor={getInputId(object['id'], key)}>{key}</label>
                  </div>
                );
              })}
          </div>
          <Button variant="contained" color="success" onClick={(event) => handlerAtivarEdicao(getDivFormName(index), event)}>
            Allow Edition
          </Button>
          {Object.keys(object)
            .filter((key) => !ignoredKeys.includes(key))
            .filter((key) => typeof object[key] !== 'boolean')
            .map((key) => {
              const properties = findInputPlusLabelProperties(key);
              const inputsProperties = getInputProperties(properties);
              return (
                <div key={key} className={styles.inputsContainer}>
                  <label onClick={handleLabelClick} htmlFor={getInputId(object['id'], key)}>
                    {key}
                  </label>
                  <input
                    type={inputsProperties.type}
                    id={getInputId(object['id'], key)}
                    name={getInputId(object['id'], key)}
                    value={object[key]}
                    maxLength={inputsProperties.maxlength}
                    onChange={(e) => handleInputChange(index, key, e.target.value)}
                    onBlur={() => handleInputBlur(index)}
                    disabled={true}
                  />
                </div>
              );
            })}
        </form>
      </div>
    );
  };

  return (
    <>
      {/* Pagination */}
      <div className={styles.pagination}>
        {itemsPerPage < formDataArray.length && (
          <div>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
              Previous
            </button>
            {[...Array(Math.ceil(formDataArray.length / itemsPerPage)).keys()].map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} disabled={currentPage === page}>
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(formDataArray.length / itemsPerPage) - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {/* Inputs */}
      <div className={styles.clientContainer}>
        {displayedData.map(renderInputs)}
      </div>
    </>
  );

}
