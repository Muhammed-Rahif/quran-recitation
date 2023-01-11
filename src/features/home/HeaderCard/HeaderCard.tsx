import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Collapse,
  Divider,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import { useAtom } from "jotai";
import { activeAudioDataState } from "../../../states/states";
import { getChapter } from "../../../helpers/api";
import { QuranChapter } from "../../../types/QuranChapter";

function HeaderCard() {
  const toast = useToast();
  const [lastReadChapter, setLastReadChapter] = useState<QuranChapter>();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastReadChapterId, setLastReadChapterId] = useLocalStorage<number>(
    "last-read-chapter",
    1
  );
  const [activeAudioState, setActiveAudioState] = useAtom(activeAudioDataState);

  useEffect(() => {
    window.onscroll = (e) => {
      if (window.scrollY !== 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
  }, []);

  useEffect(() => {
    if (!activeAudioState?.chapterNo) return;
    setLastReadChapterId(activeAudioState?.chapterNo);
  }, [activeAudioState?.chapterNo]);

  useEffect(() => {
    getChapter(lastReadChapterId)
      .then(setLastReadChapter)
      .catch((err) =>
        toast({
          title: "Ooops!",
          status: "error",
          isClosable: false,
          description: `Error:- ${
            err.message ? err.message : JSON.stringify(err)
          }`,
          position: "bottom-left",
        })
      );
  }, []);

  return (
    <LinkBox
      pos="sticky"
      top={4}
      borderRadius="2xl"
      zIndex={60}
      onClick={() => {
        if (lastReadChapterId)
          setActiveAudioState({
            ...activeAudioState!,
            chapterNo: lastReadChapterId,
          });
      }}
    >
      <Skeleton
        shadow={isScrolled ? "dark-lg" : "base"}
        pos="relative"
        startColor="green.400"
        endColor="green.900"
        my={isScrolled ? 1.5 : 4}
        borderRadius="2xl"
        zIndex={60}
        opacity={0.98}
        isLoaded={typeof lastReadChapter !== "undefined"}
      >
        <Card
          shadow={isScrolled ? "dark-lg" : "base"}
          pos="relative"
          bg="green.700"
          my={isScrolled ? 1.5 : 4}
          borderRadius="2xl"
          zIndex={60}
        >
          <CardBody pos="relative" zIndex={1} py={isScrolled ? 2 : 3}>
            <Text mb={isScrolled ? 1 : 2} fontSize="xs">
              Last Read
            </Text>

            <Box my={isScrolled ? 1.5 : 3}>
              <Flex align="center">
                <Heading
                  transition="font-size 500ms"
                  size={isScrolled ? "md" : "xl"}
                >
                  <LinkOverlay as={Link} to="./">
                    {lastReadChapter?.name_simple}
                  </LinkOverlay>
                </Heading>
                <Spacer />
                <Text textTransform="capitalize" fontSize="xs">
                  {lastReadChapter?.revelation_place}
                </Text>
              </Flex>

              <Collapse in={!isScrolled} animateOpacity>
                <Text>{lastReadChapter?.translated_name?.name}</Text>
                <Divider my={1.5} />
              </Collapse>
            </Box>

            <Collapse in={!isScrolled} animateOpacity>
              <Text fontSize="sm">
                {lastReadChapter?.name_complex} - Surah No:{" "}
                {lastReadChapter?.id}
              </Text>
              {/* Ayah No: 7*/}
            </Collapse>
          </CardBody>

          <Image
            pos="absolute"
            top="60%"
            right={4}
            w={!isScrolled ? 32 : 16}
            transform="translateY(-50%)"
            src="images/quran.png"
            alt=""
            zIndex={0}
            opacity={0.25}
            transition="width 500ms"
          />
        </Card>
      </Skeleton>
    </LinkBox>
  );
}

export default HeaderCard;
