import { useTranslation } from 'react-i18next';
import { Modal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import { SelectList } from 'app/components/SelectList';
import ListTokenItem from 'app/components/ListTokenItem';

export default function SelectTokenModal({
  tokens,
  selectCallback,
  isOpen,
  onClose,
}) {
  const { t } = useTranslation();
  const translationPath = 'common.selectTokenPopup';

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <SelectList
            options={tokens}
            ListItem={ListTokenItem}
            selectCallback={selectCallback}
            isDropdown
            dropdownTitle={t(`${translationPath}.title`)}
            closeDropdown={onClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
