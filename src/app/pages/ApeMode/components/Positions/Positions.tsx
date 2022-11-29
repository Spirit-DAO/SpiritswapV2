import { useMemo } from 'react';
import { PositionsContainer, HeaderContainer } from './styles';
import { CardHeader } from 'app/components/CardHeader';
import TablePositions from './components/Table';
import { PositionsQuantity } from './styles';
import { useTranslation } from 'react-i18next';
import { POSITIONS } from 'constants/icons';
import useMobile from 'utils/isMobile';

const Positions = () => {
  const isMobile = useMobile();
  const { t } = useTranslation();

  const translationPath = 'apeMode.common';
  const translationPathHelper = 'apeMode.helperModal';
  const columns = useMemo(
    () => [
      {
        Header: t(`${translationPath}.tokenLabel`, 'Token'),
        Label: 'token',
        accessor: 'token',
      },
      {
        Header: t(`${translationPath}.positionSizeLabel`, 'Position Size'),
        Label: 'size',
        accessor: 'size',
        isNumeric: true,
      },
      {
        Header: t(`${translationPath}.positionValueLabel`, 'Position Value'),
        accessor: 'value',
        Label: 'value',
        isNumeric: true,
      },
      {
        Header: t(`${translationPath}.liquidationLabel`, 'Liquidation Price'),
        Label: 'price',
        accessor: 'price',
        isNumeric: true,
      },
      {
        Header: t(`${translationPath}.borrow`, 'Borrow APY'),
        Label: 'APY',
        accessor: 'APY',
        isNumeric: true,
      },
    ],
    [t],
  );
  return (
    <PositionsContainer>
      <HeaderContainer>
        <CardHeader
          id={POSITIONS}
          title="Positions"
          helperContent={{
            title: 'Positions',
            text: t(
              `${translationPathHelper}.positionsExplanation`,
              'leveraged positions',
            ),
          }}
        />
      </HeaderContainer>
      {isMobile ? (
        <PositionsQuantity>
          5 {t(`${translationPath}.laveraged`, 'leveraged positions')}
        </PositionsQuantity>
      ) : null}
      <TablePositions
        columns={columns}
        isMobile={isMobile}
        variantTable={isMobile ? 'mobile' : 'default'}
      />
    </PositionsContainer>
  );
};
export default Positions;
