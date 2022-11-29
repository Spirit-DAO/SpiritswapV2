import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import { darkTheme } from 'theme/dark';
import { ReactComponent as TimesIcon } from 'app/assets/images/chevron-down.svg';
import { Sign } from 'app/utils';
import { PercentBadge } from '../PercentBadge';
import { Heading } from '../Typography';
import { Icon } from '../Icon';
import Suffix from './Suffix';

const StyledIcon = styled(Icon)`
  color: ${darkTheme.color.danger};
`;

const StyledText = styled.p`
  color: ${darkTheme.color.white};
  font-size: 0.8rem;
  margin: 0;
`;

export default {
  title: 'SpiritSwap/Components/Suffix',
  component: Suffix,
  args: {},
  argTypes: {},
} as ComponentMeta<typeof Suffix>;

const Template: ComponentStory<typeof Suffix> = args => <Suffix {...args} />;

export const WithPercentBadge = Template.bind({});
WithPercentBadge.args = {
  suffix: <PercentBadge amount={45.56} sign={Sign.POSITIVE} />,
  children: <Heading level={3}>$ 45,339.27</Heading>,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  suffix: <StyledIcon icon={<TimesIcon />} size={22} />,
  children: <Heading level={3}>$ 45,339.27</Heading>,
};

export const WithText = Template.bind({});
WithText.args = {
  suffix: <Heading level={5}>$ 45,339.27</Heading>,
  children: <StyledText>FTM/SPIRIT</StyledText>,
};

export const Alignment = Template.bind({});
Alignment.args = {
  suffix: <StyledText>FTM/SPIRIT</StyledText>,
  children: <Heading level={1}>$ 45,339.27</Heading>,
  style: { alignItems: 'baseline' },
};

export const Compound = Template.bind({});
Compound.args = {
  suffix: <PercentBadge amount={-0.33} sign={Sign.NEGATIVE} />,
  children: (
    <Suffix suffix={<PercentBadge amount={0} sign={Sign.NEUTRAL} />}>
      <Heading level={1}>$ 45,339.27</Heading>
    </Suffix>
  ),
};
