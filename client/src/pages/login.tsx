import {Box, Button, FormControl} from '@chakra-ui/react';
import {Formik, Form, FormikHelpers} from 'formik';
import {useRouter} from 'next/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import {LoginInput, useLoginMutation} from '../generated/graphql';
import {mapFieldErrors} from '../helper/mapFieldHelper';
import React from 'react';

const Login:React.FC = () => {
  const router = useRouter();
  const newInitialState: LoginInput = {usernameOrEmail: '', password: ''};

  const [loginUser, {data, error}] = useLoginMutation();

  const onLoginSubmit = async (values: LoginInput, {setErrors}: FormikHelpers<LoginInput>) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
    });
    if (response.data?.login?.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else if (response.data?.login?.user) {
      router.push('/');
    }
  };

  return (
    <Wrapper>
      {error && <p> Failed to login </p>}
      {data && data.login?.success && <p> Login sucessfully {JSON.stringify(data)} </p>}
      <Formik initialValues={newInitialState} onSubmit={onLoginSubmit}>
        {({isSubmitting}) => (
          <Form>
            <FormControl>
              <InputField
                name="usernameOrEmail"
                lable="Username or Email"
                placeholder="Please enter username or email"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  lable="Password"
                  placeholder="Please enter password"
                  type="password"
                />
              </Box>
              <Button type="submit" colorScheme="teal" mt="4" isLoading={isSubmitting}>
                Login
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
