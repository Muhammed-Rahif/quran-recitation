import React, { useEffect, useState } from "react";
import HeaderCard from "../features/home/HeaderCard/HeaderCard";
import { getAllChapters } from "../helpers/api";
import { QuranChapter } from "../types/QuranChapter";
import { Button, Circle, Grid, Heading, Text, useToast, VStack } from "@chakra-ui/react";

function Home() {
  const [allChapters, setAllChapters] = useState<QuranChapter[]>();

  const toast = useToast();

  useEffect(() => {
    getAllChapters()
      .then(data => setAllChapters(data))
      .catch(err =>
        toast({
          title: "Ooops!",
          status: "error",
          isClosable: false,
          description: `Error:- ${JSON.stringify(err)}`,
        })
      );
  }, []);

  return (
    <>
      <HeaderCard />

      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          "2xl": "repeat(5, 1fr)",
        }}
        columnGap={2}
        rowGap={2}
      >
        {allChapters?.map(({ name_simple, id, revelation_place, verses_count }, index) => (
          <Button
            justifyContent="start"
            w="100%"
            borderRadius="xl"
            colorScheme="gray"
            key={index}
            py={3}
            h="auto"
          >
            <Circle size="34px" border="2px" borderColor="green.700" color="white">
              <Text fontSize="xl">{id}</Text>
            </Circle>

            <VStack mx={4} align="start">
              <Heading size="sm">{name_simple}</Heading>
              <Text fontSize="md" fontWeight="normal" textTransform="capitalize">
                {revelation_place}, {verses_count} Ayahs
              </Text>
            </VStack>
          </Button>
        ))}
      </Grid>
    </>
  );
}

export default Home;
