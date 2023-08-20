import React, { useState, useEffect } from 'react';

export default function useFetch(url) {
  /**
 * Custom React hook for making data fetch requests.
 * @param {string} url - The URL to fetch data from.
 * @returns {object} An object containing the fetched data and loading status.
 */
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading };
}