import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getChapterVerses, getSurahAudio } from "../../../helpers/api";
import WaveSurfer from "wavesurfer.js";
import { useAtom } from "jotai";
import { activeAudioDataState } from "../../../states/states";
import { BsChevronDown, BsChevronUp, BsCloudSleet } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { SurahAudio } from "../../../types/SurahAudio";
import ReactAudioPlayer from "react-audio-player";
import { Wave, AudioElement } from "@foobar404/wave";

function ViewChapter() {
  const toast = useToast();
  const navigate = useNavigate();
  const [activeAudioState, setActiveAudioState] = useAtom(activeAudioDataState);
  const [recitationForChapter, setRecitationForChapter] =
    useState<SurahAudio>();
  const audioPlayerRef = useRef<ReactAudioPlayer | null>();

  const onModalClose = () => {
    setActiveAudioState(null);
  };

  useEffect(() => {
    if (typeof activeAudioState?.chapterNo === "number")
      Promise.all([
        getSurahAudio({
          recitationId: 2,
          chapterNo: activeAudioState?.chapterNo,
        }),
        getChapterVerses({ chapterNo: activeAudioState?.chapterNo }),
      ])
        .then(([recitationForChapter, chapterVerses]) => {
          setActiveAudioState({
            chapterNo: activeAudioState?.chapterNo,
            expandedPlayer: activeAudioState.expandedPlayer,
          });
          setRecitationForChapter(recitationForChapter);
        })
        .catch((err) => {
          toast({
            title: "Ooops!",
            status: "error",
            isClosable: false,
            description: `Error:- ${
              err.message ? err.message : JSON.stringify(err)
            }`,
            position: "bottom-left",
          });

          setTimeout(() => {
            navigate("/quran-recitation");
          }, 3000);
        });
  }, [activeAudioState?.chapterNo]);

  useEffect(() => {
    if (audioPlayerRef.current?.audioEl) {
      const canvas = document.getElementById(
        "recitation-visulization-canvas"
      ) as HTMLCanvasElement;

      // let wave = new Wave(audioPlayerRef.current?.audioEl as any, canvas);
      // wave.addAnimation(new wave.animations.Wave());
    }
  }, [audioPlayerRef]);

  return (
    <Box
      h={activeAudioState?.expandedPlayer ? "full" : "40"}
      w={activeAudioState?.expandedPlayer ? "full" : "7xl"}
      opacity={typeof activeAudioState?.chapterNo === "number" ? 1 : 0}
      pointerEvents={
        typeof activeAudioState?.chapterNo === "number" ? "auto" : "none"
      }
      p={3}
      bg="#031b13"
      pos="fixed"
      zIndex={90}
      bottom={activeAudioState?.expandedPlayer ? 0 : 5}
      transform="translateX(-50%)"
      left="50%"
      shadow="dark-lg"
      transitionDuration="500ms"
    >
      <Flex>
        <IconButton
          onClick={() =>
            setActiveAudioState({
              ...activeAudioState,
              expandedPlayer: !activeAudioState?.expandedPlayer,
            })
          }
          colorScheme="gray"
          aria-label={"button"}
        >
          {activeAudioState?.expandedPlayer ? (
            <BsChevronDown />
          ) : (
            <BsChevronUp />
          )}
        </IconButton>
        <Spacer />
        <IconButton
          onClick={onModalClose}
          colorScheme="gray"
          aria-label={"button"}
        >
          <IoMdClose />
        </IconButton>
      </Flex>

      <Collapse animateOpacity in={activeAudioState?.expandedPlayer}>
        <Box as="canvas" id="recitation-visulization-canvas" />
      </Collapse>

      <Box py={5}>
        <ReactAudioPlayer
          src={recitationForChapter?.audio_file.audio_url}
          autoPlay
          controls
          style={{ width: "100%" }}
          ref={(audioPlayer) => {
            audioPlayerRef.current = audioPlayer;
          }}
        />
      </Box>
    </Box>
  );
}

export default ViewChapter;
