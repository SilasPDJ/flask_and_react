import React from 'react'
import SearchInput from '../layout/Form/autocompleteInput' // Use an uppercase component name

export default function MenuPage() {

  return (
    <div>
      Test Page
      <SearchInput
        label={"Search title"}
        handleOnChange={(x) => console.log(x)} multiple={true}
        allowMultiple={true}
      />

    </div>
  )
}
