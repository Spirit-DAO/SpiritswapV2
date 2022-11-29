import { Skeleton } from '@chakra-ui/react';
import { FC } from 'react';
import { Props } from './Slippage.d';
import {
  StyledSlippageItemTag,
  StyledSlippageNameTag,
  StyledSlippageValueTag,
} from './styles';

const Slippage: FC<Props> = ({
  slippageName,
  slippageNameIcon,
  slippageValue,
  slippageValueIcon,
  isLoading,
  ...props
}) => {
  return (
    <StyledSlippageItemTag data-testid="Slippage">
      <StyledSlippageNameTag>
        {slippageValue && slippageName}
        {slippageNameIcon}
      </StyledSlippageNameTag>
      <StyledSlippageValueTag>
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          isLoaded={!isLoading}
        >
          {slippageValue && slippageValue}
        </Skeleton>
        {slippageValueIcon}
      </StyledSlippageValueTag>
    </StyledSlippageItemTag>
  );
};

export default Slippage;
