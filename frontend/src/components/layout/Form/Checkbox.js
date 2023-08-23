import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function CheckboxComponent({ id, onChange, label, defaultValue, colorType }) {
  colorType = colorType ? colorType : 'success';

  const [checked, setChecked] = useState(defaultValue);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    onChange();
  };

  const checkboxStyle = {
    color: colorType === 'success' ? '#00cc1f' : '', // Custom color for success type
  };

  return (
    <FormControlLabel
      control={<Checkbox id={id} name={id} checked={checked} onChange={handleChange} color={colorType} style={checkboxStyle} />}
      label={label}
    />
  );
}

export default CheckboxComponent;
