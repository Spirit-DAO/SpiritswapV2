import { StyledPanel, StyledBox } from './style';
import { CardHeader } from 'app/components/CardHeader';
import { STATS } from 'constants/icons';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Link, Skeleton, Text } from '@chakra-ui/react';
import { Select } from 'app/components/Select';
import { useState } from 'react';
import { QuestionHelper } from 'app/components/QuestionHelper';
import { ArrowDiagonalIcon } from 'app/assets/icons';
import { StatisticsProps } from './index';
import { ArcElement, Tooltip, Chart as ChartJS } from 'chart.js';
import DistributionChart from './DistributionChart';
import PegChart from './PegChart';
ChartJS.register(ArcElement, Tooltip);

const Statistics = ({
  totalInSpiritSupply,
  circulatingSpirit,
  averagePeg,
  projects,
  tokenDistribution,
  isLoadingData,
  pegChartData,
}: StatisticsProps) => {
  const { t } = useTranslation();
  const translationPath = 'spiritWars.statistics';
  const [index, setIndex] = useState(0);

  const renderCardHeader = () => (
    <CardHeader
      id={STATS}
      title="Statistics"
      helperContent={{
        title: t(`${translationPath}.helper.title`),
        text: [t(`${translationPath}.helper.text`)],
      }}
    />
  );

  const renderChartHeader = () => (
    <Box mt="spacing05" pb="16px">
      <Text color="gray" fontSize="sm" mb="spacing03">
        Charts
      </Text>

      <Select
        labels={['Distribution', 'Peg']}
        onChange={() => {
          setIndex(index === 0 ? 1 : 0);
        }}
        selected={index}
      />
    </Box>
  );

  const renderChart = () => {
    return (
      <Skeleton
        startColor="grayBorderBox"
        endColor="bgBoxLighter"
        h="300px"
        isLoaded={!isLoadingData}
      >
        <Flex minH="250px" flexDirection="column" justifyContent="center">
          {index === 0 ? (
            <DistributionChart tokens={tokenDistribution} />
          ) : (
            <PegChart pegData={pegChartData} />
          )}
        </Flex>
      </Skeleton>
    );
  };

  const renderStatistics = () => (
    <>
      <Text color="gray" fontSize="sm" mb="spacing03" mt="16px">
        Statistics
      </Text>
      {
        <>
          <Skeleton
            startColor="grayBorderBox"
            endColor="bgBoxLighter"
            mb="spacing05"
            h="300px"
            isLoaded={!isLoadingData}
          >
            <StyledBox>
              <Text color="gray" fontSize="sm">
                {t(`${translationPath}.totalInSPIRITSupply`)}
              </Text>
              <Text fontSize="xl">{totalInSpiritSupply}</Text>
            </StyledBox>
            <StyledBox>
              <Box>
                <Text color="gray" fontSize="sm" as="span" mr="8px">
                  {t(`${translationPath}.circulatingSpirit.text`)}
                </Text>
                <QuestionHelper
                  title={t(`${translationPath}.circulatingSpirit.helper.title`)}
                  text={t(`${translationPath}.circulatingSpirit.helper.text`)}
                  iconWidth="16px"
                />
              </Box>
              <Text fontSize="xl">{circulatingSpirit}</Text>
            </StyledBox>
            <StyledBox>
              <Text color="gray" fontSize="sm">
                {t(`${translationPath}.averagePeg`)}
              </Text>
              <Text fontSize="xl">{averagePeg}%</Text>
            </StyledBox>
            <StyledBox>
              <Text color="gray" fontSize="sm">
                {t(`${translationPath}.projects`)}
              </Text>
              <Text fontSize="xl">{projects}</Text>
            </StyledBox>
          </Skeleton>
        </>
      }

      <Text fontSize="sm" textAlign="center" mt="16px">
        <Text as="span" color="grayDarker">
          {t(`${translationPath}.dataProvidedBy`)}
        </Text>
        <Text as="span" color="white">
          &nbsp;
          <Link
            href="https://www.defiwars.xyz/spirit"
            target="_blank"
            _hover={{ cursor: 'pointer', color: 'ci', decoration: 'none' }}
          >
            {t(`${translationPath}.defiwars`)}
            <ArrowDiagonalIcon w="16px" h="auto" color="inherit" />
          </Link>
        </Text>
      </Text>
    </>
  );

  return (
    <StyledPanel>
      {renderCardHeader()}
      {renderChartHeader()}
      {renderChart()}
      {renderStatistics()}
    </StyledPanel>
  );
};

export default Statistics;
