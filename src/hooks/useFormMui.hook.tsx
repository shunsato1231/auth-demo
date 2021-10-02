import {
  useForm,
  UseFormProps,
  RegisterOptions
} from 'react-hook-form'


export const useFormMui = (props?: UseFormProps) => {
  const form =  useForm(props);

  const register = (name:string, option?: RegisterOptions) => {
    const response = form.register(name, option);
    return {
      inputRef: response.ref,
      onChange: response.onChange,
      onBlur: response.onBlur,
      name: response.name,
    }
  }

  return {
    ...form,
    register,
  }
}