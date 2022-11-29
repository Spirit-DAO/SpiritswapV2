import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeWrapper } from 'app/components/shared/testing/ThemeWrapper';
import { items } from '../NavigationDropdown.stories';
import { NavigationDropdown, NavigationDropdownProps } from '../';

const defaultArgs: NavigationDropdownProps = {
  items: items,
  onClickOutside: () => {},
  width: 200,
};

const Component = (props: NavigationDropdownProps) => {
  return (
    <ThemeWrapper>
      <BrowserRouter>
        <NavigationDropdown {...props} />
      </BrowserRouter>
    </ThemeWrapper>
  );
};

describe('NavigationDropdown component', () => {
  test('renders without crashing', () => {
    const { container } = render(<Component {...defaultArgs} />);
    expect(container.firstChild).toBeTruthy();
  });

  test('items', () => {
    const { container } = render(<Component {...defaultArgs} />);
    const links = container.querySelectorAll('a');

    expect(links.forEach(s => s.title)).toBe(links.forEach(s => s.text));
    expect(links.length).toBe(items.length);
  });

  test('onClickOutside', () => {
    const handleClick = jest.fn();
    render(<Component {...defaultArgs} onClickOutside={handleClick} />);
    fireEvent.mouseDown(document);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
