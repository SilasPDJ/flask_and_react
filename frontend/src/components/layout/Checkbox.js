import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

function CheckboxComponent({ id, defaultValue, label, colorType }) {
  colorType = colorType ? colorType : 'success'

  const [checked, setChecked] = React.useState(defaultValue);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <FormControlLabel
      control={<Checkbox id={id} name={id} checked={checked} onChange={handleChange} color={colorType} />}
      label={label}
    />
  );
}

export default CheckboxComponent;
