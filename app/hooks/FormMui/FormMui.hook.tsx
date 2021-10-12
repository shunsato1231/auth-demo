import {
  useForm,
  UseFormReturn,
  UseFormProps,
  RegisterOptions,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form';

type UseFormMuiRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  options?: RegisterOptions<TFieldValues, TFieldName>
) => Omit<UseFormRegisterReturn, 'ref'> & {
  inputRef: UseFormRegisterReturn['ref'];
};

type UseFormMuiReturn = Omit<UseFormReturn, 'register'> & {
  register: UseFormMuiRegister<FieldValues>;
};

export const useFormMui = (props?: UseFormProps): UseFormMuiReturn => {
  const form = useForm(props);

  const register = (name: string, option?: RegisterOptions) => {
    const response = form.register(name, option);
    return {
      inputRef: response.ref,
      onChange: response.onChange,
      onBlur: response.onBlur,
      name: response.name,
    };
  };

  return {
    ...form,
    register,
  };
};
