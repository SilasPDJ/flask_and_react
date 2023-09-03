import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api/';

export default function useFetchWithPathParams(url, ...pathParams) {
  const makeUrl = (url, ...pathParams) => {
    let fullUrl = new URL(BASE_URL + url);

    if (pathParams.length > 0) {
      const path = pathParams.join('/');
      fullUrl.pathname += '/' + path;
    }
    return fullUrl.toString();
  };


  const mainUrl = makeUrl(url, pathParams).replace(',', '/');

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
  }, [mainUrl]);

  return [data, setData];
}
