import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React, { useState } from 'react'

export default function SelectMui({ objects, label, onChange }) {
  const [value, setValue] = useState(""); // State to manage the selected value

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {Object.entries(objects).map(([name, value]) => (
            <MenuItem key={value} value={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
