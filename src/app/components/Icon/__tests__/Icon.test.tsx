import { render } from '@testing-library/react';
import { Icon, IconProps } from 'app/components/Icon';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { ReactComponent as GhostIcon } from 'app/assets/images/ghost.svg';
import { spacing } from 'theme/base/spacing';

const defaultProps: IconProps = {
  icon: <GhostIcon />,
  size: 20,
};

const Component = (props: IconProps) => {
  return (
    <ThemeWrapper>
      <Icon {...props} />
    </ThemeWrapper>
  );
};

describe('Icon component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component {...defaultProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  test('icon', () => {
    const { container } = render(<Component {...defaultProps} />);
    const icon = container.querySelectorAll('svg');
    expect(icon).toMatchSnapshot(`<svg>ghost.svg</svg>`);
  });

  test('size big', () => {
    const { container } = render(<Component {...defaultProps} size="big" />);
    expect(container.firstChild).toHaveStyle({
      width: spacing.spacing07,
      height: spacing.spacing07,
    });
  });

  test('size normal', () => {
    const { container } = render(<Component {...defaultProps} size="normal" />);
    expect(container.firstChild).toHaveStyle({
      width: spacing.spacing06,
      height: spacing.spacing06,
    });
  });

  test('size small', () => {
    const { container } = render(<Component {...defaultProps} size="small" />);
    expect(container.firstChild).toHaveStyle({
      width: spacing.spacing05,
      height: spacing.spacing05,
    });
  });

  test('size number', () => {
    const size = 40;
    const { container } = render(<Component {...defaultProps} size={size} />);
    expect(container.firstChild).toHaveStyle({
      width: `${size}px`,
      height: `${size}px`,
    });
  });
});
