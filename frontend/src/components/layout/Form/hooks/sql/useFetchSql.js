import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api/sql/';

export default function useFetchSql(url, ...queryParams) {
  // console.log(url)
  const makeUrl = (endpoint) => new URL(endpoint, BASE_URL).toString();

  const mainUrl = makeUrl(url);
  // console.log(mainUrl)

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(mainUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // Adjust body according to your needs
          body: JSON.stringify(queryParams) // Example payload
        });
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
