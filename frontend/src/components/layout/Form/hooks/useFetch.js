import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api/';

export default function useFetch(url, options) {

  /**
   * Custom React hook for making data fetch requests.
   * @param {string} url - The URL to fetch data from.
   * @returns {Array} An array containing the fetched data.
   */

  const makeUrl = (endpoint) => new URL(endpoint, BASE_URL).toString();

  let mainUrl = makeUrl(url);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(mainUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url, options]);

  return [data, setData];
}
