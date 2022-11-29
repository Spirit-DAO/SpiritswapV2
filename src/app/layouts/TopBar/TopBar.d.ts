import { StyledComponent } from 'styled-components';
import { FunctionComponent, SVGProps } from 'react';

export interface MoreButtonProps {
  clicked: boolean;
}

export interface MenuButtonProps {
  is_active: boolean;
}

export interface NavMenuProps {
  menu: {
    title: string;
    path: string;
    pathname?: string;
    icon?:
      | StyledComponent<FunctionComponent<SVGProps<SVGSVGElement>>>
      | undefined;
  };
  is_active: boolean;
}
export interface navMenusType {
  icon: JSX.Element;
  key: string;
  path: string;
}
export interface navDropdownMenusType {
  key: string;
  path: string;
  url?: string;
}

export interface Props {}
