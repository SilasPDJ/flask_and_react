import React from 'react';
import postData from '../../hooks/postData';

export default function PostDataHandler({ data }) {
  const [postDataValue, setPostDataValue] = React.useState(data);
  const [responseData, setResponseData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await postData('trying_to_get_data_from_form', { data: postDataValue });
      setResponseData(response);
    } catch (error) {
      setError(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Sending and Fetching Data</h1>
      <input type="text" value={postDataValue} onChange={(e) => setPostDataValue(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {responseData && <p>Response: {JSON.stringify(responseData)}</p>}
    </div>
  );
}
