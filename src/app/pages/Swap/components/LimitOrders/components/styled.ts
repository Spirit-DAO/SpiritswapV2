import styled from 'styled-components';

export const StatusBarWrapper = styled.div`
  background-color: #eaeaea;
  border-radius: 16px;
  width: 100%;
  height: 8px;
  margin-top: 8px;
`;

export const StatusBarInner = styled.div<{
  isCompleted: boolean;
  completedPercent: number;
}>`
width: ${({ completedPercent }) => completedPercent}%;
height: 100%;
border-radius: 16px;
background-color: ${({ isCompleted }) => (isCompleted ? '#00b124' : '#ff7e4b')}}
`;

export const StatusBarValue = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 50px;
  display: inline-block;
  margin-right: 3px;
`;

export const StatusBarPercent = styled.span<{ isCompleted: boolean }>`
  padding: 4px 6px;
  border-radius: 6px;
  ${({ isCompleted }) =>
    isCompleted
      ? `background-color: #d6ffdf;
                color: #177029;`
      : `
background-color: #fff0ea;
color: #de4f17;
                `}
`;
