import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

interface TabSelectProps {
  names: string[];
  panels?: {
    key: number;
    children: React.ReactNode;
  }[];
  setIndex: (index: number) => void;
  index: number;
  styleIndex?: number[];
  styleVariant?: string;
  w?: string;
  mx?: string;
  onSelect?: (value: string) => void;
}

export default function TabSelect({
  names,
  panels,
  setIndex,
  index,
  styleIndex,
  styleVariant,
  onSelect,
  w = 'fit-content',
  mx = '20px',
}: TabSelectProps) {
  return (
    <Tabs
      size="sm"
      variant={styleIndex?.includes(index) ? styleVariant : 'unstyled'}
      onChange={index => setIndex(index)}
      index={index}
      mx={mx}
    >
      <TabList w={w}>
        {names.map(name => (
          <Tab
            w={w}
            key={name}
            fontSize="sm"
            fontWeight="medium"
            onClick={() => onSelect && onSelect(name)}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {panels?.map(({ key, children }) => (
          <TabPanel key={key}>{children}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
