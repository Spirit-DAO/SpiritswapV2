import { Tag, Text } from '@chakra-ui/react';
import ImageLogo from 'app/components/ImageLogo';

export default function TagIcon({ text, icon }) {
  return (
    <Tag>
      <ImageLogo symbol={text} size="24px" />
      <Text fontSize="14px">{text}</Text>
    </Tag>
  );
}
