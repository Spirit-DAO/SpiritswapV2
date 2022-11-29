import { render, screen, fireEvent } from '@testing-library/react';
import { IconToInput, IconToInputProps } from 'app/components/IconToInput';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { ReactComponent as LockIcon } from 'app/assets/images/lock.svg';

const Component = (props: IconToInputProps) => {
  return (
    <ThemeWrapper>
      <IconToInput {...props} />
    </ThemeWrapper>
  );
};

describe('IconToInput component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).toBeTruthy();
  });

  test('opened', () => {
    const { container } = render(<Component open={true} />);
    const element = container.querySelector('input');
    expect(element).toBeTruthy();
  });

  test('closed', () => {
    const { container } = render(<Component open={false} />);
    const element = container.querySelector('input');
    expect(element).toBeFalsy();
  });

  test('open and disabled', () => {
    const { container } = render(<Component open={true} disabled={true} />);
    const element = container.querySelector('input');
    expect(element).toHaveAttribute('disabled');
  });

  test('with custom icon', () => {
    const icon = <LockIcon />;
    const { container } = render(<Component open={true} icon={icon} />);
    const element = container.querySelector('svg');
    expect(element).toMatchSnapshot('<svg>lock.svg</svg>');
  });

  test('placeholder', () => {
    const placeholder: string = 'Search for token...';
    render(<Component open={true} placeholder={placeholder} />);
    screen.getByPlaceholderText(placeholder);
  });

  test('onChange', () => {
    const demoInput: string = 'Demo input';
    const { container } = render(<Component open={true} />);
    const input = container.querySelector('input');
    expect(input).toBeTruthy();

    if (input) {
      fireEvent.change(input, { target: { value: demoInput } });
      expect(input.value).toBe(demoInput);
    }
  });
});
