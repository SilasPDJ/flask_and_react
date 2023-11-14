import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React, { useState } from 'react';

/**
 * Componente de seleção com opções exibidas lado a lado.
 * 
 * @param {Object} objects - Objeto contendo as opções a serem exibidas.
 * @param {string} label - Rótulo para o componente Select.
 * @param {function} onChange - Função chamada ao selecionar uma opção.
 * @param {number} [opcoesPorLinha=1] - Número de opções a serem exibidas por linha.
 * 
 * @returns {JSX.Element} Elemento JSX do componente.
 */

export default function SelectMui({ objects, label, onChange, opcoesPorLinha = 1 }) {
  const [value, setValue] = useState(""); // Estado para gerenciar a opção selecionada

  const [isOptionsMenuOpened, setisOptionsMenuOpened] = useState(true)
  // TODO detectar se o overflow-y for 0, se for diferente, se a barra de overflow setiver na posição 0, setta true, se diferente, setta false 

  /*
   * Manipula a mudança de seleção.
  */
  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  // Mapeia o número de opções por linha para a largura correspondente em porcentagem.
  const larguraPorOpcoes = { 1: "100%", 2: "50%", 3: "33%", 4: "25%", 5: "20%" };

  return (
    <>
      <FormControl fullWidth variant="filled" sx={{ m: 1, mx: "auto" }}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
          style={{ textAlign: "center" }}
          MenuProps={{
            // disableScrollLock: true,
          }}
        // open={isOptionsMenuOpened}
        >
          {Object.entries(objects).map(([name, value], index) => (
            <MenuItem
              key={value}
              value={value}
              style={{ display: 'inline-block', width: larguraPorOpcoes[opcoesPorLinha] }} // Opções lado a lado
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
