import { Action } from '@reduxjs/toolkit';
import { RootState } from './RootState';

export type { RootState };

export interface PayloadedAction<T = any> extends Action {
  payload?: T;
}

export interface WorkerCall {
  type: string;
  network?: number;
  isLoggedIn?: boolean;
  signer?: string;
  userAddress?: string;
}
