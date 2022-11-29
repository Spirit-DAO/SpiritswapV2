import { Text } from '@chakra-ui/react';
import { ArrowDiagonalIcon } from 'app/assets/icons';
import { onClickUrl } from 'app/utils/redirectTab';
import { FC } from 'react';
import { ICollapseDetail } from './SpiritWars';
import {
  DetailContentWrapper,
  StyledPanelBox,
  StyledPanelBoxHeader,
} from './style';

export const CollapseDetail: FC<ICollapseDetail> = ({
  title,
  showArrow,
  text,
  type,
}) => {
  const dotString = (value: string): string => {
    return value.substring(0, 6) + '...' + value.substring(value.length - 5);
  };
  return (
    <StyledPanelBox>
      {title && <StyledPanelBoxHeader>{title}</StyledPanelBoxHeader>}
      <DetailContentWrapper>
        <Text fontSize="base" as="span">
          {showArrow ? dotString(text) : text}
        </Text>
        {showArrow && (
          <ArrowDiagonalIcon
            onClick={
              type === 'token'
                ? onClickUrl(`https://ftmscan.com/token/${text}`)
                : onClickUrl(`https://ftmscan.com/address/${text}`)
            }
            _hover={{ cursor: 'pointer', color: 'ci' }}
          />
        )}
      </DetailContentWrapper>
    </StyledPanelBox>
  );
};
