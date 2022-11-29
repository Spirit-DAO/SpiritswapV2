const checkDisabled = (firstToken, secondToken, balanceOne, balanceTwo) => {
  return (
    firstToken.value === '' ||
    firstToken.value === '0' ||
    firstToken.value === '0.0' ||
    secondToken.value === '' ||
    secondToken.value === '0' ||
    secondToken.value === '0.0' ||
    balanceOne === 0 ||
    balanceTwo === 0 ||
    isNaN(firstToken.value) ||
    isNaN(secondToken.value) ||
    isNaN(balanceOne) ||
    isNaN(balanceTwo)
  );
};

export default checkDisabled;
