import { SAFE_EXECUTE_NUMBER_OF_ATTEMPTS } from 'constants/index';

export const safeExecuteNotAsync = (
  _callback: Function,
  _onError?: Function, // Error handling callback, will return caught error if not defined
  _attempt = SAFE_EXECUTE_NUMBER_OF_ATTEMPTS, // How many times we are to execute function
  _attemptsMade = 0, // How many times have been used to far to execute
) => {
  try {
    const result = _callback();

    return result;
  } catch (e) {
    if (_attempt > 0 && _attempt) {
      // return safeExecute(_callback, _onError, _attempt - 1, _attemptsMade + 1);
    }

    if (_onError) {
      return _onError(e, _attemptsMade);
    }
    throw e;
  }
};

// Wrapper function meant to safely execute functions with fallbacks in place
const safeExecute = async (
  _callback: Function,
  _onError?: Function, // Error handling callback, will return caught error if not defined
  _attempt = SAFE_EXECUTE_NUMBER_OF_ATTEMPTS, // How many times we are to execute function
  _attemptsMade = 0, // How many times have been used to far to execute
) => {
  try {
    const result = await _callback();

    return result;
  } catch (e) {
    if (_attempt > 0 && _attempt) {
      // return safeExecute(_callback, _onError, _attempt - 1, _attemptsMade + 1);
    }

    if (_onError) {
      return _onError(e, _attemptsMade);
    }
    throw e;
  }
};

export default safeExecute;
