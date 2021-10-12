import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useField } from "formik";

interface IInputFieldProps {
  name: string;
  lable: string;
  placeholder?: string;
  type?: string | "text";
}
const InputField = (props: IInputFieldProps) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl>
      <FormLabel htmlFor={field.name}> {props.lable} </FormLabel>
      <Input {...field} id={field.name} {...props} />
      {error && <FormErrorMessage> {error} </FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
