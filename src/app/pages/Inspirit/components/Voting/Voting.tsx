import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Heading } from 'app/components/Typography';
import { StyledVoting, StyledPanel } from '../../styles';
import { Select } from 'app/components/Select';
import {
  checkLastVotes,
  voteForBoostedDistributions,
} from 'utils/web3/actions';
import { Button, Flex, HStack, Text, useDisclosure } from '@chakra-ui/react';
import Web3Monitoring from 'app/connectors/EthersConnector/transactions';
import { StyledHeader, StyledHeaderParagraph } from './styles';
import { CardHeader } from 'app/components/CardHeader';
import { VOTING } from 'constants/icons';
import { ERROR_MUST_SUM_100 } from 'constants/errors';
import UseIsLoading from 'app/hooks/UseIsLoading';
import { VotingPanel } from './components/VotingPanel';
import { BoostedFarm } from 'app/interfaces/Inspirit';
import { PlusIcon } from 'app/assets/icons';
import useWallets from 'app/hooks/useWallets';
import useMobile from 'utils/isMobile';

function Voting() {
  const { t } = useTranslation();
  const translationPath = 'inSpirit.voting';
  const translationPathHelper = 'inSpirit.modalHelper';
  const { account } = useWallets();
  const { addToQueue } = Web3Monitoring();
  const [errorMessage, setErrorMessage] = useState('');
  const { isLoading, loadingOff, loadingOn } = UseIsLoading();
  const newBribeDisclosure = useDisclosure();
  const isMobile = useMobile('1076px');

  const cleanErrorMessage = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const onCreateBribe = () => {
    newBribeDisclosure.onOpen();
  };

  const [selectedFarmType, setSelectedFarmType] = useState<{
    index: number;
    value: string;
  }>({ index: 0, value: 'Variable' });

  // Version id 1 for combine farms
  const VERSION_ID = 1;
  const handleVote = async (tableData: BoostedFarm[], newVotes) => {
    let votingWeight = 0;

    const vaults: BoostedFarm[] = [];

    for (let i = 0; i < tableData.length; i++) {
      const vault = tableData[i];
      const { fulldata } = vault;
      const address = fulldata.farmAddress;
      if (newVotes[address]) {
        const weight = parseFloat(`${newVotes[address]}`);
        if (weight && address) {
          votingWeight += weight;
        }
        vaults.push({ ...vault, value: newVotes[address] });
      }
    }

    const canVote = await checkLastVotes(account, VERSION_ID);

    if (!canVote) {
      setErrorMessage('You can only vote once in 7 days');
    }
    if (votingWeight !== 100) {
      setErrorMessage(ERROR_MUST_SUM_100);
    } else if (votingWeight === 100 && canVote) {
      try {
        loadingOn();
        const response = await voteForBoostedDistributions({
          vaults,
          version: VERSION_ID,
        });
        await response.tx.wait();
        loadingOff();
        addToQueue(response);
      } catch (e) {
        console.error(e, 'error');
        loadingOff();
      }
    }
  };

  const onChangeFarmType = selected => {
    setSelectedFarmType(selected);
  };

  return (
    <StyledVoting gridArea="Voting" id="voting_section" isMobile={isMobile}>
      <StyledPanel>
        <StyledHeader>
          <Flex direction="column" w="100%">
            <HStack w={'100%'} justifyContent={'space-between'}>
              <CardHeader
                title={t(`${translationPath}.title`)}
                id={VOTING}
                helperContent={{
                  title: t(`${translationPathHelper}.voting`),
                  text: t(`${translationPathHelper}.votingExplanation`),
                  showDocs: true,
                }}
              />
              <Button onClick={onCreateBribe}>
                <PlusIcon />
                <Text fontWeight="medium" fontSize="sm">
                  New Bribe
                </Text>
              </Button>
            </HStack>
            <StyledHeaderParagraph>
              {t(`${translationPath}.subtitle`)}
            </StyledHeaderParagraph>
          </Flex>
        </StyledHeader>

        <Flex flexDir="column" marginY="spacing06">
          <Heading level={5}>{t(`${translationPath}.farmType.label`)}</Heading>
          <Select
            labels={['Variable', 'Stable']}
            onChange={onChangeFarmType}
            selected={selectedFarmType.index}
          />
        </Flex>

        <VotingPanel
          errorMessage={errorMessage}
          handleVote={handleVote}
          farmType={selectedFarmType}
          isLoading={isLoading}
          cleanError={cleanErrorMessage}
          newBribeDisclosure={newBribeDisclosure}
        />
      </StyledPanel>
    </StyledVoting>
  );
}

export default Voting;
