import React from 'react'
import styles from './FormGenerator.module.css'
import useFetch from './hooks/useFetch';


export default function FormGenerator({ urlGetForm }) {
  const [template, setFormRef] = useFetch(urlGetForm)


  return (
    <div className={styles.form_generated}>
      <div 
      dangerouslySetInnerHTML={{ __html: template['html'] }} />
    </div>
  )
}
