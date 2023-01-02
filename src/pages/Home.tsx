import { Card, CardBody, Divider, Text } from "@chakra-ui/react";
import React from "react";

function Home() {
  return (
    <Card my={4}>
      <CardBody>
        <Text mb={2} fontSize="xs">
          Last Read
        </Text>

        <Text fontSize="xl" fontWeight="bold">
          Al-Fatihah
        </Text>
        <Text fontSize="sm">The Opener</Text>

        <Divider my={2} />

        <Text fontSize="sm">Ayah No: 7</Text>
      </CardBody>
    </Card>
  );
}

export default Home;
