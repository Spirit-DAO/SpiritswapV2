import TokensTable from '../TokensTable/TokensTable';
import { Skeleton, Stack } from '@chakra-ui/react';
import times from 'lodash/times';

const StyledSkeleton = () => (
  <Skeleton
    startColor="grayBorderBox"
    endColor="bgInput"
    height="4.75rem"
    bg={'bgInput'}
  />
);

export const TokensTableV2 = ({ items, onVoteInputChange }) => {
  return (
    <>
      {items && items.length > 0 ? (
        <TokensTable
          items={items}
          showBribes={true}
          onChange={onVoteInputChange}
        />
      ) : (
        <Stack>
          {times(3, index => (
            <StyledSkeleton key={index} />
          ))}
        </Stack>
      )}
    </>
  );
};
