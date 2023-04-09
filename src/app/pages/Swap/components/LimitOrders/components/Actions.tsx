import { Button } from '@chakra-ui/react';

const Actions = ({
  isCompleted,
  isClosed,
  handleCollect,
  isLoading,
  allCollect,
  allCancel,
}) => {
  return (
    <div className="limit-order-item__cell">
      {!isCompleted ||
        (!isClosed && (
          <Button
            disabled={
              isLoading ||
              (isCompleted && allCollect) ||
              (!isCompleted && allCancel)
            }
            isLoading={isLoading}
            loadingText={isCompleted ? 'Collecting' : 'Canceling'}
            onClick={handleCollect}
          >
            {isCompleted ? <span>Collect</span> : <span>Cancel</span>}
          </Button>
        ))}
    </div>
  );
};

export default Actions;
