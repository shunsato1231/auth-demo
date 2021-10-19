import {
  UseFormRegisterReturn,
  RefCallBack,
  ChangeHandler,
  InternalFieldName,
} from 'react-hook-form';

export const registerMui = (
  res: UseFormRegisterReturn
): {
  inputRef: RefCallBack;
  onChange: ChangeHandler;
  onBlur: ChangeHandler;
  name: InternalFieldName;
} => ({
  inputRef: res.ref,
  onChange: res.onChange,
  onBlur: res.onBlur,
  name: res.name,
});
