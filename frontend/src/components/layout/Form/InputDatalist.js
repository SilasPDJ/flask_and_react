import React, { useState } from 'react';
import { TextField, } from '@mui/material';
import slugify from '../../helpers/slugify'
import styles from './InputDatalist.module.css'

export default function Datalist({ list, elId, label, handleOnChange, allowMultiple }) {
  return (
    <div className={styles.datalist}>
      {/* O escopo do estilo é limitado ao proprio elemento */}
      <label htmlFor={elId}>{label}</label>
      <datalist id={elId}>
        {list.map((element, index) => (
          <option key={index} value={element} />
        ))}
      </datalist>

      <input list="opcoes" />

    </div>
  );
}
