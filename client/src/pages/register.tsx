import {Box, Button, FormControl} from '@chakra-ui/react';
import {Formik, Form, FormikHelpers} from 'formik';
import {useRouter} from 'next/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import {RegisterInput, useRegisterMutation} from '../generated/graphql';
import {mapFieldErrors} from '../helper/mapFieldHelper';
import React from 'react';

const Register:React.FC = () => {
  const router = useRouter();
  const newInitialState: RegisterInput = {username: '', email: '', password: ''};

  const [registerUser, {data, error}] = useRegisterMutation();

  const onRegisterSubmit = async (
      values: RegisterInput,
      {setErrors}: FormikHelpers<RegisterInput>,
  ) => {
    const response = await registerUser({
      variables: {
        registerInput: values,
      },
    });
    if (response.data?.register?.errors) {
      setErrors(mapFieldErrors(response.data.register.errors));
    } else if (response.data?.register?.user) {
      router.push('/');
    }
  };

  return (
    <Wrapper>
      {error && <p> Failed to register </p>}
      {data && data.register?.success && <p> Registered sucessfully {JSON.stringify(data)} </p>}
      <Formik initialValues={newInitialState} onSubmit={onRegisterSubmit}>
        {({isSubmitting}) => (
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
