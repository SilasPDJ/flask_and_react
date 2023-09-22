import React, { useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import slugify from '../../helpers/slugify'

export default function SearchInput({ label, list, handleOnChange, allowMultiple }) {
  list = list == undefined ? ["Hello World", 'Teste'] : list;

  return (
    <Autocomplete
      disablePortal
      autoHighlight
      id={slugify(label, "-")}
      options={list}
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{
            width: 350,
            margin: '10px auto',
          }}
        />
      )}
      onChange={(event, newValue) => {
        handleOnChange(newValue)

      }}
      multiple={allowMultiple ? true : false} />
  );
}
