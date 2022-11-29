export interface SettingsProps {
  txGweiCost?: string;
  isBridge?: boolean;
  toggleSettings: () => void;
  states: {
    showChart: boolean;
    slippage: string;
    speedIndex: number;
    approveMax?: boolean;
    deadline?: number;
    bridgeMode?: string;
  };
  handlers: {
    handleSlippage: (value: string) => void;
    handleTxSpeed?: (value: string) => void;
    handleShowChart: (value: boolean) => void;
    handleApproveMax?: (value: boolean) => void;
    handleDeadline: (value: number) => void;
    handleSpeedIndex: (value: number) => void;
    handleBridgeMode?: (value: string) => void;
    handleResetAll: () => void;
  };
}
