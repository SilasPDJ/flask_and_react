import React from 'react'
import InputDatalist from '../layout/Form/InputDatalist'
// Use an uppercase component name

export default function MenuPage() {

  return (
    <div>
      <h1>Teste</h1>
      <InputDatalist
        label={"Search title"}
        list={["ola", "tudo", "bem"]}
        handleOnChange={(x) => console.log(x)} multiple={true}
        allowMultiple={true}
      />

    </div>
  )
}
