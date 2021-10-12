import { Box, Button, FormControl } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { registerMutation } from "../graphql-client/mutation";
import { useMutation } from "@apollo/client";

const Register = () => {
  const newInitialState: NewUserInput = { username: "", email: "", password: "" };

  interface UserMutationResponse {
    code: number;
    success: boolean;
    message: string;
    user: string;
    errors: string;
  }

  interface NewUserInput {
    username: string;
    email: string;
    password: string;
  }

  const [registerUser, { data, error }] = useMutation<
    { register: UserMutationResponse },
    { registerInput: NewUserInput }
  >(registerMutation);

  const onRegisterSubmit = (values: NewUserInput) => {
    return registerUser({
      variables: {
        registerInput: values,
      },
    });
  };

  return (
    <Wrapper>
      {error && <p> Failed to register </p>}
      {data && data.register.success && <p> Registered sucessfully {JSON.stringify(data)} </p>}
      <Formik initialValues={newInitialState} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField name="username" lable="Username" placeholder="Please enter username" />
              <Box mt={4}>
                <InputField name="email" lable="Email" placeholder="Please enter email" />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  lable="Password"
                  placeholder="Please enter password"
                  type="password"
                />
              </Box>
              <Button type="submit" colorScheme="teal" mt="4" isLoading={isSubmitting}>
                Register
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
