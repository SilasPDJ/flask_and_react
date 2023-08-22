import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api/';

async function postData(url, data) {
  const mainUrl = new URL(url, BASE_URL).toString();
  console.log(mainUrl)
  try {
    const response = await fetch(mainUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export default postData;