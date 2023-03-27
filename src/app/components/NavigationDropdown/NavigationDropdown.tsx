import { FC, useEffect, useState } from 'react';
import { useOnClickOutside } from 'app/hooks/useOnClickOutSide';
import { Props, DropdownMenuLink } from './NavigationDropdown.d';
import {
  StyledNavLink,
  CommonLink,
  DropdownWrapper,
  ColumnWrapper,
  StyledColumnHeading,
} from './styles';
import useMobile from 'utils/isMobile';
import {
  FarmIcon,
  QuestionIcon,
  BridgeIcon,
  ApeIcon,
  DSynthsIcon,
  LendAndBorrowIcon,
  AnalyticsIcon,
  MenuInspirit,
  DocsIcon,
  GovernanceIcon,
  NFTIcon,
  MartialArtsSwordFencingIcon,
  BuyCryptoIcon,
  MoneyHandIcon,
} from 'app/assets/icons';
import { openInNewTab } from 'app/utils/redirectTab';
import { resolveRoutePath } from 'app/router/routes';

const NavigationDropdown: FC<Props> = ({
  items,
  onClickOutside,
  width,
}: Props) => {
  const ref = useOnClickOutside<HTMLInputElement>(onClickOutside);
  const [features, setFeatures] = useState<DropdownMenuLink[]>([]);
  const [spiritSwap, setSpiritSwap] = useState<DropdownMenuLink[]>([]);
  const isMobile = useMobile();

  const renderIcon = name => {
    const props = {
      mr: '10px',
      pb: '2px',
      color: 'white',
    };
    switch (name) {
      case 'Farms':
        return <FarmIcon {...props} />;
      case 'Bridge':
        return <BridgeIcon {...props} />;
      case 'Ape Mode':
        return <ApeIcon {...props} />;
      case 'inSPIRIT':
        return <MenuInspirit {...props} />;
      case 'Analytics':
        return <AnalyticsIcon {...props} />;
      case 'dSynths':
        return <DSynthsIcon {...props} />;
      // case 'Lend/Borrow':
      //   return <LendAndBorrowIcon {...props} />;
      case 'Docs':
        return <DocsIcon {...props} />;
      // case 'Governance':
      //   return <GovernanceIcon {...props} />;
      // case 'NFTs':
      //   return <NFTIcon {...props} />;
      case 'SpiritWars':
        return <MartialArtsSwordFencingIcon {...props} />;
      // case 'Buy FTM':
      //   return <BuyCryptoIcon {...props} />;
      case 'Liquidity':
        return <MoneyHandIcon {...props} />;
      default:
        return <QuestionIcon {...props} />;
    }
  };
  const renderLink = (item, index) => {
    const link = item.path ? (
      <StyledNavLink
        key={item.path}
        to={resolveRoutePath(item.path)}
        onClick={onClickOutside}
        end={true}
      >
        {renderIcon(item.title)}
        {item.title}
      </StyledNavLink>
    ) : (
      <CommonLink
        key={`external-link-${index}`}
        onClick={() => {
          openInNewTab(item.url);
          onClickOutside();
        }}
      >
        {renderIcon(item.title)}
        {item.title}
      </CommonLink>
    );

    return link;
  };
  const renderFeatures = () => {
    return features.map((item, index) => renderLink(item, index));
  };

  const renderSpiritSwap = () => {
    return spiritSwap.map((item, index) => renderLink(item, index));
  };

  useEffect(() => {
    const SpiritSwapLinks = new Set(['Analytics', 'Docs', 'Governance']);

    const features: DropdownMenuLink[] = [];
    const spiritSwap: DropdownMenuLink[] = [];

    items.forEach(item => {
      if (SpiritSwapLinks.has(item.title)) {
        spiritSwap.push(item);
      } else {
        features.push(item);
      }
    });

    setFeatures(features);
    setSpiritSwap(spiritSwap);
  }, [items]);

  return (
    <DropdownWrapper
      ref={ref}
      width={isMobile ? (98 * (width ?? 0)) / 100 : width}
    >
      {/* <ColumnWrapper>
        <StyledColumnHeading>Features</StyledColumnHeading>
        {renderFeatures()}
      </ColumnWrapper> */}
      <ColumnWrapper>
        <StyledColumnHeading>SpiritSwap</StyledColumnHeading>
        {renderSpiritSwap()}
      </ColumnWrapper>
    </DropdownWrapper>
  );
};

export default NavigationDropdown;
