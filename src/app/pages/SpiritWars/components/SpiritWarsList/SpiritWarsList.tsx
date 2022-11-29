import { StyledPanel, MobileContainer, MobileTableWrapper } from './style';
import { CardHeader } from 'app/components/CardHeader';
import { SPIRITWARS } from 'constants/icons';
import { useTranslation } from 'react-i18next';
import { Flex, Text, Accordion, Box, Skeleton } from '@chakra-ui/react';
import CollapseItem from './CollapseItem';
import useMobile from 'utils/isMobile';
import { breakpoints } from './../../../../../theme/base/breakpoints';
import { Props, getIcon } from './index';
import { ArrowDiagonalIcon } from 'app/assets/icons';
import { onClickUrl } from 'app/utils/redirectTab';
import { CollapseDetail } from './CollapseDetail';

const SpiritWarsList = ({ tokens, isLoadingData }: Props) => {
  const { t } = useTranslation();
  const translationPath = 'spiritWars';
  const isMobile = useMobile(breakpoints.md);

  const renderCardHeader = () => (
    <CardHeader
      id={SPIRITWARS}
      title="SpiritWars"
      helperContent={{
        title: t(`${translationPath}.helper.title`),
        text: [t(`${translationPath}.helper.text`)],
      }}
    />
  );

  const DesktopView = () => {
    const renderCollapseHeader = () => {
      const headers = [
        t(`${translationPath}.tableHeading.projects`),
        t(`${translationPath}.tableHeading.holdings`),
        t(`${translationPath}.tableHeading.peg`),
      ];

      return (
        <Flex justifyContent="center" pl="20px" pr="36px">
          {headers.map((heading, index) => (
            <Box
              fontSize="sm"
              color="grayDarker"
              flex={[0, 1].includes(index) ? 1.5 : 1}
              key={heading}
            >
              {heading}
            </Box>
          ))}
        </Flex>
      );
    };

    return (
      <>
        {renderCollapseHeader()}
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          minH="445px"
          isLoaded={!isLoadingData}
        >
          <Accordion allowToggle variant="spiritwars" mt="8px">
            {tokens.map((token, i) => (
              <CollapseItem key={`${token.tokenName}${i}`} {...token} />
            ))}
          </Accordion>
        </Skeleton>
      </>
    );
  };

  const MobileView = () => {
    const Cell = ({
      autoHeight = true,
      heading = false,
      children,
      ...props
    }) => (
      <MobileContainer heading={heading} autoHeight={autoHeight} {...props}>
        {children}
      </MobileContainer>
    );

    const Col = ({ children, ...props }) => (
      <Flex flexDir="column" alignItems="flex-start" {...props} gap="4px">
        {children}
      </Flex>
    );

    const tableHeadings = [
      t(`${translationPath}.tableHeading.farm`),
      t(`${translationPath}.tableHeading.holdings`),
      t(`${translationPath}.tableHeading.peg`),
      t(`${translationPath}.tableHeading.holder`),
      t(`${translationPath}.tableHeading.token`),
      t(`${translationPath}.tableHeading.supply`),
    ];

    const renderTableHeader = () => (
      <Col>
        {tableHeadings.map((heading, index) =>
          index === 0 ? (
            <Cell heading fontSize="xs" fontWeight="medium" autoHeight={false}>
              {heading}
            </Cell>
          ) : (
            <Cell heading fontSize="xs" fontWeight="medium">
              {heading}
            </Cell>
          ),
        )}
      </Col>
    );

    return (
      <Flex position="relative">
        {renderTableHeader()}
        <Skeleton
          startColor="grayBorderBox"
          endColor="bgBoxLighter"
          w="70%"
          isLoaded={!isLoadingData}
        >
          <MobileTableWrapper>
            {tokens.map(
              ({
                projectName,
                tokenName,
                projectLink,
                inSpiritHolderAddress,
                inSpiritHoldingPercent,
                inSpiritHoldings,
                pegFor100k,
                tokenAddress,
              }) => {
                return (
                  <Col>
                    <Cell
                      fontSize="sm"
                      justifyContent="space-between"
                      autoHeight={false}
                      bg="red"
                    >
                      <Flex gap="8px">
                        {getIcon(projectName, '20px', '20px')}
                        <Box>
                          <Text>{projectName}</Text>
                          <Text color="grayDarker" fontSize="sm">
                            {tokenName}
                          </Text>
                        </Box>
                      </Flex>
                      <ArrowDiagonalIcon
                        onClick={onClickUrl(projectLink)}
                        _active={{ cursor: 'pointer', color: 'ci' }}
                      />
                    </Cell>
                    <Cell fontSize="sm">
                      {`${inSpiritHoldings}(${inSpiritHoldingPercent}%)`}
                    </Cell>
                    <Cell
                      fontSize="sm"
                      color={
                        pegFor100k === 'coming soon'
                          ? 'gray'
                          : Number(pegFor100k) > 90
                          ? 'ci'
                          : 'dangerBorder'
                      }
                    >
                      {pegFor100k === 'coming soon'
                        ? `${pegFor100k}`
                        : `${pegFor100k}%`}
                    </Cell>
                    <Cell fontSize="sm">
                      <CollapseDetail
                        title={''}
                        text={inSpiritHolderAddress}
                        showArrow={true}
                      />
                    </Cell>
                    <Cell fontSize="sm" justifyContent="space-between">
                      {tokenAddress !== '' && (
                        <CollapseDetail
                          title={''}
                          text={inSpiritHolderAddress}
                          showArrow={true}
                          type="token"
                        />
                      )}
                    </Cell>
                    {/* TODO: for now placing inspirit holdings as per Sid's instruction. Change in future for appropriate value */}
                    <Cell fontSize="sm">{inSpiritHoldings}&nbsp;SPIRIT</Cell>
                  </Col>
                );
              },
            )}
          </MobileTableWrapper>
        </Skeleton>
      </Flex>
    );
  };

  return (
    <Box>
      <StyledPanel>
        {renderCardHeader()}

        <Text fontSize="sm" color="grayDarker" mt="22px" mb="20px">
          {t(`${translationPath}.description`)}
        </Text>

        {isMobile ? <MobileView /> : <DesktopView />}
      </StyledPanel>
    </Box>
  );
};

export default SpiritWarsList;
