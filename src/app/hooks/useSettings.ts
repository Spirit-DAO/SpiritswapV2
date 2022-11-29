import { BRIDGE_MODE } from 'constants/index';
import { useState } from 'react';
import {
  DEFAULT_DEADLINE,
  SLIPPAGE_TOLERANCES,
  SPEED_PRICES,
} from 'utils/swap';

const useSettings = () => {
  const settingsOptions = JSON.parse(
    localStorage.getItem('settingsOptions') || '{}',
  );

  const [slippage, setSlippage] = useState<string>(
    settingsOptions.slippage ?? SLIPPAGE_TOLERANCES[1],
  );

  const [speedIndex, setSpeedIndex] = useState<number>(
    settingsOptions.speedIndex ?? 0,
  );

  const [txSpeed, setTxSpeed] = useState(
    settingsOptions.txSpeed ?? SPEED_PRICES.STANDARD,
  );

  const [deadline, setDeadLine] = useState<number>(
    settingsOptions.deadline ?? DEFAULT_DEADLINE,
  );

  const [showChart, setShowChart] = useState<boolean>(
    settingsOptions.showChart ?? false,
  );

  const [approveMax, setApproveMax] = useState<boolean>(
    settingsOptions.approveMax ?? true,
  );

  const [bridgeMode, setBridgeMode] = useState<string>(
    settingsOptions.bridgeMode || BRIDGE_MODE.cheap,
  );

  const handleSlippage = (value: string) => {
    setSlippage(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, slippage: value }),
    );
  };

  const handleTxSpeed = (value: string) => {
    setTxSpeed(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, txSpeed: value }),
    );
  };

  const handleShowChart = (value: boolean) => {
    setShowChart(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, showChart: value }),
    );
  };

  const handleDeadline = (value: number) => {
    setDeadLine(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, deadline: value }),
    );
  };

  const handleSpeedIndex = (value: number) => {
    setSpeedIndex(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, speedIndex: value }),
    );
  };

  const handleApproveMax = (value: boolean) => {
    setApproveMax(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, approveMax: value }),
    );
  };

  const handleBridgeMode = (value: string) => {
    setBridgeMode(value);
    localStorage.setItem(
      'settingsOptions',
      JSON.stringify({ ...settingsOptions, bridgeMode: value }),
    );
  };

  const handleResetAll = () => {
    setBridgeMode(BRIDGE_MODE.cheap);
    setSlippage(SLIPPAGE_TOLERANCES[1]);
    setTxSpeed(SPEED_PRICES.STANDARD);
    setDeadLine(DEFAULT_DEADLINE);
    setSpeedIndex(0);
    setApproveMax(true);
    setShowChart(false);
  };

  return {
    handlers: {
      handleSlippage,
      handleTxSpeed,
      handleSpeedIndex,
      handleApproveMax,
      handleDeadline,
      handleShowChart,
      handleBridgeMode,
      handleResetAll,
    },
    states: {
      bridgeMode,
      slippage,
      speedIndex,
      approveMax,
      txSpeed,
      deadline,
      showChart,
    },
  };
};

export default useSettings;
