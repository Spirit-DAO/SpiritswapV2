import Input from 'app/components/Input/Input';
import type { Props } from './SearchInput.d';
import { ReactComponent as SearchIcon } from 'app/assets/images/search-loupe.svg';
import type { FC } from 'react';

const SearchInput: FC<Props> = (props: Props) => {
  return <Input {...props} iconPrefix={<SearchIcon />} />;
};

export default SearchInput;
