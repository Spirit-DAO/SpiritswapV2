import { HStack, Flex, Button } from '@chakra-ui/react';
import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers: any = [];

  for (let i: any = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <HStack
      bg="ciTrans15"
      mt="10px"
      p="10px"
      borderRadius="5px"
      placeContent="center"
    >
      {pageNumbers.map(number => (
        <Flex key={number}>
          <Button
            style={{ cursor: 'pointer' }}
            bg={number === currentPage ? 'ciTrans15' : 'ciTrans10'}
            color="ci"
            onClick={() => {
              paginate(number);
            }}
          >
            {number}
          </Button>
        </Flex>
      ))}
    </HStack>
  );
};

export default Pagination;
