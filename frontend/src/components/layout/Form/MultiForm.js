import React, { useCallback, useState, useEffect } from 'react';
import styles from './MultiForm.module.css';
import useFetchWithPathParams from './hooks/useFetchWitPathParams';
import { Button, Checkbox } from '@mui/material';
import handleDataSubmit from './DataSubmit';

// TODO: id should not be an input?

export default function MultiForm({ formDataArray, setFormDataArray, categoryFilter, ignoredKeysArray, inputsExtrasNaoEditaveisArray, getPropertiesFrom, formDataTitleKey, apiUrlPostUpdate, itemsPerPage }) {
  const ignoredKeys = ignoredKeysArray || [''];
  const arrayOfExtraInputsNaoEditaveis = inputsExtrasNaoEditaveisArray || [''];
  const [mainInputsProperties, setMainInputsProperties] = useFetchWithPathParams('inputs_properties', getPropertiesFrom);
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    // Create a filtered array based on the categoryFilter
    const filteredDataArray = formDataArray.filter((e) => {
      // Include filter for "categoryFilter"
      if (categoryFilter && categoryFilter !== "ALL") {
        return e.imposto_a_calcular === categoryFilter;
      }
      return true; // Include all elements when categoryFilter is not applied
    });

    // Calculate the start and end indices for the current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Create an array to store the current page's data
    const currentPageData = filteredDataArray.slice(startIndex, endIndex);

    setDisplayedData(currentPageData);
  }, [currentPage, formDataArray, itemsPerPage, categoryFilter]);

  const filterWithoutId = (t) => !(t.id.includes('_id') || t.id.includes('id_'));


  //  Handlers
  const getObjectIndex = (formDataArray, identifier) => {
    return formDataArray.findIndex(data => data['id'] === identifier);
  };
  // ...

  const handlerAtivarEdicao = (divId, event) => {
    let buttonCaller = event.target;
    let divForm = document.getElementById(divId);
    let _inputs = divForm.querySelectorAll('input');
    const mainInputs = Array.from(_inputs);
    const inputsToToggle = mainInputs
      .filter((el) => {
        for (const loop of arrayOfExtraInputsNaoEditaveis) {
          if (el.id.endsWith(loop)) {
            return false; // Exclude this element
          }
        }
        return true; // Include this element
      });
    // .filter(input => {

    //   return true; // Mantenha este input
    // });
    for (const term of arrayOfExtraInputsNaoEditaveis) {
      console.log(term)
    }


    // console.log(inputsToToggle)
    inputsToToggle.forEach((input) => {
      input.disabled = !input.disabled;
    });

    if (inputsToToggle[0].disabled) {
      buttonCaller.textContent = 'ALLOW EDITION';
    } else {
      buttonCaller.textContent = 'PROTECT EDITION';
    }
  };


  const handleInputChange = useCallback((identifier, key, value) => {
    setFormDataArray((prevFormDataArray) => {
      const updatedFormDataArray = [...prevFormDataArray];
      const objectIndex = getObjectIndex(updatedFormDataArray, identifier);
      if (objectIndex !== -1) {
        updatedFormDataArray[objectIndex][key] = value;

        // Se a chave for 'sem_retencao' ou 'com_retencao', calcule o valor_total
        if (key === 'sem_retencao' || key === 'com_retencao') {
          const semRetValue = parseFloat(updatedFormDataArray[objectIndex]['sem_retencao']) || 0;
          const comRetValue = parseFloat(updatedFormDataArray[objectIndex]['com_retencao']) || 0;
          updatedFormDataArray[objectIndex]['valor_total'] = semRetValue + comRetValue;
          updatedFormDataArray[objectIndex]['pode_declarar'] = true;
        }
      }

      return updatedFormDataArray;
    });
  }, [setFormDataArray]);


  const handleInputBlur = (identifier) => {
    const objectIndex = getObjectIndex(formDataArray, identifier);
    if (objectIndex !== -1) {
      const responseData = handleDataSubmit(apiUrlPostUpdate, formDataArray[objectIndex]);
      // console.log(responseData);
    }
  };

  const handleCheckboxChange = useCallback((identifier, key, checked) => {
    setFormDataArray((prevFormDataArray) => {
      const updatedFormDataArray = [...prevFormDataArray];
      const objectIndex = getObjectIndex(updatedFormDataArray, identifier);
      if (objectIndex !== -1) {
        updatedFormDataArray[objectIndex][key] = checked;

        // Submit Data
        const responseData = handleDataSubmit(apiUrlPostUpdate, updatedFormDataArray[objectIndex]);
        console.log(responseData);
      }

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
    const identifier = object['id'];

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
      <div id={getDivFormName(identifier)} key={identifier} className={styles.clientColumn}>
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
                      checked={formDataArray.find(data => data['id'] === object['id']) ? formDataArray.find(data => data['id'] === object['id'])[key] : false}
                      inputProps={{
                        id: getInputId(object['id'], key),
                        name: getInputId(object['id'], key),
                        disabled: true,
                      }}
                      color="success"
                      onChange={(event) => handleCheckboxChange(identifier, key, event.target.checked)}
                    />
                    <label htmlFor={getInputId(object['id'], key)}>{key}</label>
                  </div>
                );
              })}
          </div>
          <Button variant="contained" color="success" onClick={(event) => handlerAtivarEdicao(getDivFormName(identifier), event)}>
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
                    onChange={(e) => handleInputChange(object['id'], key, e.target.value)} // Use identifier here
                    onBlur={() => handleInputBlur(object['id'])} // Use identifier here
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
