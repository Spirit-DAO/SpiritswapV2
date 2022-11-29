import { HStack } from '@chakra-ui/react';
import { CardHeader } from 'app/components/CardHeader';
import { POSITIONS } from 'constants/icons';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledIconToInput } from '../style';

const LimitHeader = ({
  hasOpenOrders,
  onSearch,
}: {
  hasOpenOrders: boolean;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const translationPath = 'portfolio.limitOrderPanel';
  const { t } = useTranslation();
  return (
    <HStack w="full" align="center">
      <CardHeader
        id={POSITIONS}
        title={t(`${translationPath}.header.title`)}
        helperContent={{
          title: t(`${translationPath}.helper.title`),
          text: [t(`${translationPath}.helper.text`)],
          showDocs: true,
        }}
      />
      {hasOpenOrders && <StyledIconToInput onChange={onSearch} />}
    </HStack>
  );
};

export default LimitHeader;
