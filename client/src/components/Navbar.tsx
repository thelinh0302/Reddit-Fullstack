import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const { data, loading, error } = useMeQuery();
  let body;
  if (loading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        {" "}
        <NextLink href="/login">
          <Link> Login </Link>
        </NextLink>
        <NextLink href="/register">
          <Link ml={2}> Register </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <NextLink href="/register">
          <Button ml={2}> Logout </Button>
        </NextLink>{" "}
      </>
    );
  }
  return (
    <Box bg="tan" p={4}>
      <Flex maxW={800} justifyContent="space-between" m="auto" alignItems="center">
        <Heading>
          {" "}
          <NextLink href="/">Reddit</NextLink>{" "}
        </Heading>
        <Box>{body}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
