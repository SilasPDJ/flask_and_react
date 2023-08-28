import postData from './helpers/postData';

export default async function handleDataSubmit(url, data) {
  try {
    const responseData = await postData(url, data);
    console.log(responseData)
    return responseData;
  } catch (error) {
    return error
  }
}