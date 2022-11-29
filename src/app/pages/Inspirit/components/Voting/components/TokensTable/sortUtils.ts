const compareFn = (firstValue, secondValue, dir: 'asc' | 'des' = 'asc') => {
  if (dir === 'des') {
    if (firstValue < secondValue) return 1;
    if (firstValue > secondValue) return -1;
    if (firstValue === secondValue) return 0;
  }
  if (firstValue < secondValue) return -1;
  if (firstValue > secondValue) return 1;
  if (firstValue === secondValue) return 0;
  return 0;
};

const compareNumbersFn = (current, next, dir?) => {
  const currentValue = Number(current);
  const nextValue = Number(next);
  return compareFn(currentValue, nextValue, dir);
};

const sortFn = (list, by, dir?) => {
  if (!list || !list.length) return [];
  switch (by) {
    case 'boostedFarms':
      return [...list].sort((a, b) => {
        const currentFirstToken = a.tokens[0].toUpperCase();
        const nextFirstToken = b.tokens[0].toUpperCase();
        const returnValue = compareFn(currentFirstToken, nextFirstToken, dir);
        if (returnValue === 0) {
          const currentSecondToken = a.tokens[1].toUpperCase();
          const nextSecondToken = b.tokens[1].toUpperCase();
          return compareFn(currentSecondToken, nextSecondToken, dir);
        }
        return returnValue;
      });
    case 'totalLiquidity':
      return [...list].sort((a, b) =>
        compareNumbersFn(a.liquidity, b.liquidity, dir),
      );
    case 'bribes':
      return list;
    case 'globalVoting':
      return [...list].sort((a, b) =>
        compareNumbersFn(a.userVotes, b.userVotes, dir),
      );
    case 'rewards':
      return [...list].sort((a, b) =>
        compareNumbersFn(a.bribes, b.bribes, dir),
      );
    case 'userRewards':
      return [...list].sort((a, b) =>
        compareNumbersFn(a.feeEarns, b.feeEarns, dir),
      );
    case 'yourVote':
      return [...list].sort((a, b) =>
        compareNumbersFn(
          a.value.replace('%', ''),
          b.value.replace('%', ''),
          dir,
        ),
      );
    case 'liquidityPer10kInspirit':
      return [...list].sort((a, b) =>
        compareNumbersFn(
          a.liquidityPer10kInspirit,
          b.liquidityPer10kInspirit,
          dir,
        ),
      );
    default:
      return list;
  }
};

export default sortFn;
