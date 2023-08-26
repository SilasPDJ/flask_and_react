
/**
 * Sorts and extracts data objects from `fullData` based on an array of IDs.
 *
 * @param {Array} fullData - The array containing full data objects with "ID" property.
 * @param {Array} idArrayBasis - The array of IDs specifying the sorting order and extraction basis.
 * @param {string} extractedKey - The optional key to extract from each sorted data object.
 * @returns {Array} An array of sorted data objects or extracted values, based on `extractedKey`.
 */
export default function getSortedDataBasedOnArray(fullData, idArrayBasis, extractedKey) {


  // Map the data objects to an object where keys are IDs and values are objects
  const idToObject = {};
  fullData.forEach(obj => {
    idToObject[obj.ID] = obj;
  });

  // Sort the data array based on the order of IDs in idArray
  const sortedData = idArrayBasis.map(id => idToObject[id]);
  if (extractedKey) {
    const razaoSocialArray = sortedData.map(obj => obj[extractedKey]);
    return razaoSocialArray;
  } else {
    return sortedData
  }


}
