import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ArrowDiagonalIcon } from 'app/assets/icons';
import { getIcon, Token } from './index';
import { onClickUrl } from 'app/utils/redirectTab';
import { CollapseDetail } from './CollapseDetail';

const CollapseItem = ({
  projectName,
  tokenName,
  projectLink,
  inSpiritHolderAddress,
  inSpiritHoldingPercent,
  inSpiritHoldings,
  pegFor100k,
  tokenAddress,
  color,
}: Token) => {
  return (
    <AccordionItem
      bgColor="bgBoxLighter"
      mb="4px"
      borderRadius="4px"
      borderLeft={`4px solid ${color}`}
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            pl="3"
            _expanded={{ bgColor: 'bgInput' }}
            minH="63px"
          >
            <Flex width="100%" textAlign="left" alignItems="center">
              <Flex flex={1.5} gap="12px" _hover={{ color: 'ci' }}>
                {getIcon(projectName)}
                <Box>
                  <Box>
                    <Text
                      fontSize="xl"
                      as="span"
                      pr="4px"
                      onClick={onClickUrl(projectLink)}
                    >
                      {projectName}
                    </Text>
                    <ArrowDiagonalIcon
                      onClick={onClickUrl(projectLink)}
                      color="inherit"
                    />
                  </Box>
                  <Text color="grayDarker" fontSize="sm">
                    {tokenName}
                  </Text>
                </Box>
              </Flex>
              <Text flex={1.5} fontSize="base">
                {inSpiritHoldings} {`(${inSpiritHoldingPercent}%)`}
              </Text>
              <Text
                flex={1}
                fontSize="base"
                color={
                  !pegFor100k
                    ? 'gray'
                    : Number(pegFor100k) > 90
                    ? 'ci'
                    : 'dangerBorder'
                }
              >
                {pegFor100k ? `${pegFor100k}%` : '-'}
              </Text>
            </Flex>
            <AccordionIcon
              color={isExpanded ? 'ci' : 'gray'}
              _hover={{ color: 'ci' }}
            />
          </AccordionButton>
          <Box>
            <AccordionPanel pb={4} bgColor="bgInput">
              <Flex gap="8px">
                <CollapseDetail
                  text={inSpiritHolderAddress}
                  showArrow={true}
                  title={'inSpirit holder'}
                />
                {tokenAddress && (
                  <CollapseDetail
                    text={tokenAddress}
                    showArrow={true}
                    title={'Token address'}
                    type="token"
                  />
                )}
                <CollapseDetail
                  text={inSpiritHoldings}
                  showArrow={false}
                  title={'SPIRIT supply'}
                />
              </Flex>
            </AccordionPanel>
          </Box>
        </>
      )}
    </AccordionItem>
  );
};

export default CollapseItem;
