import { Props as DateTimeProps } from './DateTime.d';
import { StyledTime } from './styles';

const displayDate = (ISODateTime, locale, options = {}) => {
  try {
    const d = new Date(ISODateTime);
    return d.toLocaleDateString(locale, options);
  } catch (e) {
    return ISODateTime;
  }
};

const DateTime = ({
  ISODateTime,
  locale,
  options,
  dataTest,
  textColor,
}: DateTimeProps) => (
  <StyledTime dateTime={ISODateTime} data-test={dataTest} color={textColor}>
    {displayDate(ISODateTime, locale || 'en-GB', options)}
  </StyledTime>
);

export default DateTime;
