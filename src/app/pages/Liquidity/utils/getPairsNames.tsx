const getPairsNames = (pairsList: string[]) => {
  const arrayLength = pairsList?.length;
  let finalString = '';
  const isTheLast = arrayLength - 1;
  pairsList?.forEach((item, index) => {
    if (isTheLast === index) return (finalString += item);

    finalString += item + ' + ';
  });
  return finalString;
};

export default getPairsNames;
