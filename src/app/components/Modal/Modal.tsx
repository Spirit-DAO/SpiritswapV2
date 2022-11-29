import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ReactComponent as Close } from 'app/assets/images/close.svg';
import { Props } from './Modal.d';
import {
  StyledPanel,
  TopContainer,
  TitleLabel,
  StyledIconButton,
  BodyContainer,
} from './styles';
import { Box, useOutsideClick } from '@chakra-ui/react';

const modalRoot = document.querySelector('#modal-root') as HTMLElement;

const ModalContainer = ({ children }) => {
  const el = useRef(document.createElement('div'));

  useEffect(() => {
    const current = el.current;
    if (modalRoot) {
      modalRoot.appendChild(current);
    } else {
      const newNode = document.createElement('div');
      newNode.setAttribute('id', 'modal-root');
      const rootNode = document.querySelector('#root');
      rootNode?.after(newNode);
      newNode.appendChild(current);
    }

    return () => {
      modalRoot?.removeChild(current);
    };
  }, []);

  return createPortal(children, el.current);
};

const Modal = ({
  title,
  showClose = true,
  children,
  onClose,
  ...props
}: Props) => {
  const ref = useRef(null);
  useOutsideClick({
    ref,
    handler: () => onClose(),
  });

  return (
    <ModalContainer>
      <Box ref={ref}>
        <StyledPanel {...props}>
          <TopContainer>
            <TitleLabel>{title}</TitleLabel>
            {showClose && (
              <StyledIconButton
                data-testid="close-action"
                icon={<Close />}
                size="big"
                variant="inverted"
                onClick={() => onClose()}
              />
            )}
          </TopContainer>
          <BodyContainer>{children}</BodyContainer>
        </StyledPanel>
      </Box>
    </ModalContainer>
  );
};

export default Modal;
