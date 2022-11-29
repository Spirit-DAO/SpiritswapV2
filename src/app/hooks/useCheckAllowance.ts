import { useEffect, useState } from 'react';
import { checkAllowance } from 'utils/web3';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export const useCheckAllowance = (firstToken, secondToken, account, target) => {
  const [approved, setApproved] = useState(true);
  const [approvalDiff, setApprovalDiff] = useState<BigNumber>();

  useEffect(() => {
    // Verifies if token given has allowance for swaps
    const verifyFirstTokenAllowance = async (
      _tokenOne,
      _allowanceTarget: string,
    ) => {
      const allowance = await checkAllowance(
        account,
        _tokenOne.tokenSelected.address,
        _allowanceTarget,
      );

      const amountRequested = parseUnits(
        _tokenOne.value || '0',
        _tokenOne.tokenSelected.decimals,
      );

      if (allowance.lt(amountRequested)) {
        setApprovalDiff(amountRequested);
        return setApproved(false);
      }
      return setApproved(true);
    };

    // No need to check allowance for FTM or unwrapping WFTM to FTM
    const wftmToFtmTrade =
      firstToken.tokenSelected.symbol === 'WFTM' &&
      secondToken.tokenSelected.symbol === 'FTM';

    if (
      firstToken &&
      firstToken.tokenSelected.symbol !== 'FTM' &&
      target &&
      !wftmToFtmTrade
    ) {
      verifyFirstTokenAllowance(firstToken, target);
    }
  }, [firstToken, secondToken, target, account, setApproved]);

  return [approved, setApproved, approvalDiff] as const;
};
