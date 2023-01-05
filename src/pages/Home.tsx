import { useEffect, useState } from "react";
import HeaderCard from "../features/home/HeaderCard/HeaderCard";
import { getAllChapters } from "../helpers/api";
import { QuranChapter } from "../types/QuranChapter";
import {
  Button,
  Circle,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ViewChapter from "./ViewChapter";

const INIT_ARR_LENGTH = 10;

function Home() {
  const toast = useToast();

  const [activeChapterNo, setActiveChapterNo] = useState<number | null>();

  const [allChapters, setAllChapters] = useState<QuranChapter[]>(
    new Array(INIT_ARR_LENGTH).fill({} as QuranChapter)
  );

  useEffect(() => {
    getAllChapters()
      .then(data => {
        setAllChapters(data);
      })
      .catch(err =>
        toast({
          title: "Ooops!",
          status: "error",
          isClosable: false,
          description: `Error:- ${err.message ? err.message : JSON.stringify(err)}`,
          position: "bottom-left",
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
        pb={4}
      >
        {allChapters?.map(({ name_simple, id, revelation_place, verses_count }, index) => (
          <Button
            isLoading={allChapters.length === INIT_ARR_LENGTH}
            justifyContent={allChapters.length === INIT_ARR_LENGTH ? "center" : "start"}
            w="100%"
            borderRadius="xl"
            colorScheme="gray"
            key={index}
            py={allChapters.length === INIT_ARR_LENGTH ? 0 : 3}
            h="auto"
            onClick={() => setActiveChapterNo(id)}
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

      <Modal
        onClose={() => setActiveChapterNo(null)}
        size="full"
        isOpen={typeof activeChapterNo === "number"}
        colorScheme="green"
      >
        <ModalOverlay />

        <ModalContent bgColor="#031b13">
          {/* <ModalHeader>Modal Title</ModalHeader>*/}
          <ModalCloseButton />

          <ModalBody>
            {activeChapterNo && <ViewChapter chapterNo={activeChapterNo!} />}
          </ModalBody>

          {/* <ModalFooter>
            <Button onClick={() => setActiveChapterNo(null)}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Home;
