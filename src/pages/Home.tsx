import React from "react";
import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <LinkBox>
      <Card pos="relative" bg="green.700" my={4} borderRadius="2xl">
        <CardBody pos="relative" zIndex={1}>
          <Text mb={2} fontSize="xs">
            Last Read
          </Text>

          <Box my={3}>
            <Flex align="center">
              <Heading>
                <LinkOverlay as={Link} to="/">
                  Al-Fatihah
                </LinkOverlay>
              </Heading>
              <Spacer />
              <Text fontSize="xs">Makkah</Text>
            </Flex>

            <Text>The Opener</Text>
            <Divider my={1.5} />
          </Box>

          <Text fontSize="sm">Ayah No: 7</Text>
        </CardBody>

        <Image
          pos="absolute"
          top="60%"
          right={4}
          w={32}
          transform="translateY(-50%)"
          src="/images/quran.png"
          alt=""
          zIndex={0}
          opacity={0.25}
        />
      </Card>
    </LinkBox>
  );
}

export default Home;
