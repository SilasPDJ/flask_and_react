import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api/';

function postData(url, data) {
  const mainUrl = new URL(url, BASE_URL).toString();
  try {
    const response = fetch(mainUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    // console.log(response)
    if (!response.ok) {
      // throw new Error('Network response was not ok');
    }
    const responseData = response.json();
    return responseData;
  } catch (error) {
    // console.log(error)
    // throw error;
  }
}

export default postData;