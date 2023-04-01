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
  AnalyticsIcon,
  MenuInspirit,
  DocsIcon,
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
  const [Leviathan, setLeviathan] = useState<DropdownMenuLink[]>([]);
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
      case 'Ape Mode':
        return <ApeIcon {...props} />;
      case 'inSPIRIT':
        return <MenuInspirit {...props} />;
      case 'Analytics':
        return <AnalyticsIcon {...props} />;
      case 'Docs':
        return <DocsIcon {...props} />;
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

  const renderLeviathan = () => {
    return Leviathan.map((item, index) => renderLink(item, index));
  };

  useEffect(() => {
    const SpiritSwapLinks = new Set(['Analytics', 'Docs']);

    const features: DropdownMenuLink[] = [];
    const Leviathan: DropdownMenuLink[] = [];

    items.forEach(item => {
      if (SpiritSwapLinks.has(item.title)) {
        Leviathan.push(item);
      } else {
        features.push(item);
      }
    });

    setFeatures(features);
    setLeviathan(Leviathan);
  }, [items]);

  return (
    <DropdownWrapper
      ref={ref}
      width={isMobile ? (98 * (width ?? 0)) / 100 : width}
    >
      <StyledColumnHeading>Leviathan</StyledColumnHeading>
      {renderLeviathan()}
    </DropdownWrapper>
  );
};

export default NavigationDropdown;
