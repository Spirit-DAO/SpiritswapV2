import { render, screen } from '@testing-library/react';
import { PercentBadge, PercentBadgeProps } from '../';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { Sign } from 'app/utils';

const defaultProps: PercentBadgeProps = {
  sign: Sign.POSITIVE,
  amount: 1,
  showIcon: true,
};

const Component = (props: PercentBadgeProps) => {
  return (
    <ThemeWrapper>
      <PercentBadge {...props} />
    </ThemeWrapper>
  );
};

describe('PercentBadge component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  test('amount', () => {
    const amount: string = '105.05';
    render(<Component {...defaultProps} amount={amount} />);
    screen.getByText(amount);
  });

  test('show icon', () => {
    const { container } = render(
      <Component {...defaultProps} showIcon={true} sign={Sign.POSITIVE} />,
    );
    const element = container.querySelector('svg');
    expect(element).toBeTruthy();
  });

  test('hide icon', () => {
    const { container } = render(
      <Component {...defaultProps} showIcon={false} />,
    );
    const element = container.querySelector('svg');
    expect(element).toBeFalsy();
  });

  test('icon positive', () => {
    const { container } = render(
      <Component {...defaultProps} showIcon={true} sign={Sign.POSITIVE} />,
    );
    const element = container.querySelector('svg');
    expect(element).toMatchSnapshot('<svg>chevron-up.svg</svg>');
  });

  test('icon negative', () => {
    const { container } = render(
      <Component {...defaultProps} showIcon={true} sign={Sign.NEGATIVE} />,
    );
    const element = container.querySelector('svg');
    expect(element).toMatchSnapshot('<svg>chevron-down.svg</svg>');
  });

  test('icon neutral', () => {
    const { container } = render(
      <Component {...defaultProps} showIcon={true} sign={Sign.NEUTRAL} />,
    );
    const element = container.querySelector('svg');
    expect(element).toMatchSnapshot('<svg>chevron-side.svg</svg>');
  });
});
