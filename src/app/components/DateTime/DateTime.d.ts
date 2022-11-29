import React from 'react';

export interface Props extends React.TimeHTMLAttributes<HTMLButtonElement> {
  locale?: string;
  ISODateTime: string;
  options?: {
    weekday?: string;
    year?: string;
    month?: string;
    day?: string;
    timeZone?: string;
    timeZoneName?: string;
    hour12?: string;
  };
  className?: string;
  dataTest?: string;
  textColor?: string;
}
