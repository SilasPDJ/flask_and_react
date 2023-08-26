import React, { useState } from 'react';

export default function MultiForm() {
  const initialFormData1 = [
    { label: 'Field 1', value: '' },
    { label: 'Field 2', value: '' },
    // Add more fields as needed
  ];

  const initialFormData2 = [
    { label: 'Field A', value: '' },
    { label: 'Field B', value: '' },
    // Add more fields as needed
  ];

  const [formData1, setFormData1] = useState(initialFormData1);
  const [formData2, setFormData2] = useState(initialFormData2);

  const handleInputChange = (index, value, setter) => {
    setter(prevFormData => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].value = value;
      console.log(prevFormData)
      return updatedFormData;
    });
  };

  return (
    <div>
      <h2>Form 1</h2>
      {formData1.map((field, index) => (
        <div key={index}>
          <label>{field.label}</label>
          <input
            type="text"
            value={field.value}
            onChange={e => handleInputChange(index, e.target.value, setFormData1)}
          />
        </div>
      ))}

      <h2>Form 2</h2>
      {formData2.map((field, index) => (
        <div key={index}>
          <label>{field.label}</label>
          <input
            type="text"
            value={field.value}
            onChange={e => handleInputChange(index, e.target.value, setFormData2)}
          />
        </div>
      ))}
    </div>
  );
}
