import * as React from 'react';

export interface Props {
  Image: React.FunctionComponent<any>;
  title: string;
  text: string;
  buttons: Button[];
}

interface Button {
  Icon?: React.FunctionComponent<any>;
  type: string;
  label: string;
  action: () => void;
}
