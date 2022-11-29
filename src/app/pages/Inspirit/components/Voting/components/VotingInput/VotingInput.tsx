import { Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import useWallets from 'app/hooks/useWallets';
import { useEffect, useState } from 'react';
import useMobile from 'utils/isMobile';

const VotingInput = ({
  yourVote,
  onNewVote,
  lpAddress,
  cleanError,
  resetVoting,
}) => {
  const [newVote, setNewVote] = useState(yourVote);
  const { account } = useWallets();
  const isMobile = useMobile();

  useEffect(() => {
    if (resetVoting) {
      const resetValue = '0';
      setNewVote(resetValue);
    } else {
      setNewVote(prevState => (prevState === newVote ? prevState : newVote));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetVoting]);

  const handleVote = (value: string) => {
    const numberValue = value.includes('%') ? value.trim() : value;

    const isnum = /^\d+$/.test(numberValue);
    if (numberValue === '') {
      setNewVote(value);
      onNewVote(numberValue ? numberValue : yourVote, lpAddress);
    }

    if (isnum) {
      setNewVote(numberValue);
      onNewVote(numberValue ? numberValue : yourVote, lpAddress);
    }
    cleanError();
  };

  return (
    <InputGroup
      w={isMobile ? 'full' : '100px'}
      border="1px solid #374151"
      borderRadius="8px"
      float="right"
    >
      <Input
        onFocus={({ target }) =>
          target.value === '0' ? setNewVote('') : setNewVote(target.value)
        }
        onBlur={() => setNewVote(newVote ? newVote : yourVote)}
        fontSize="sm"
        borderColor={yourVote !== '0' ? 'ci' : 'initial'}
        disabled={account ? false : true}
        textAlign="center"
        max="100"
        value={newVote}
        onChange={({ target }) => handleVote(target.value)}
      />
      <InputRightElement>
        <Text fontSize="sm">%</Text>
      </InputRightElement>
    </InputGroup>
  );
};

export default VotingInput;
