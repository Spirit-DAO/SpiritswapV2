import { render } from '@testing-library/react';
import { DateTime } from 'app/components/DateTime';
import { DateTimeProps } from 'app/components/DateTime';
import { ThemeWrapper } from '../../shared/testing/ThemeWrapper';

describe('Date Component', () => {
  const renderComponent = props =>
    render(
      <ThemeWrapper>
        <DateTime {...props} />
      </ThemeWrapper>,
    );

  it('should render UK date correctly', () => {
    const props: DateTimeProps = {
      ISODateTime: '2021-04-14T11:11:42+00:00',
      locale: 'en-GB',
    };
    const { getByText } = renderComponent(props);
    const component = getByText('14/04/2021');
    expect(component).toBeTruthy();
  });

  it('should render US date correctly', () => {
    const props = {
      ISODateTime: '2021-04-14T11:11:42+00:00',
      locale: 'en-US',
    };
    const { getByText } = renderComponent(props);
    const component = getByText('4/14/2021');
    expect(component).toBeTruthy();
  });
});
