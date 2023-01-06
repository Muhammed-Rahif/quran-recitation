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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChapterVerses, getSurahAudio } from "../../../helpers/api";
import WaveSurfer from "wavesurfer.js";
import { useAtom } from "jotai";
import { activeAudioDataState } from "../../../states/states";
import { BsChevronDown, BsChevronUp, BsCloudSleet } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

function ViewChapter() {
  const toast = useToast();
  const navigate = useNavigate();
  const [activeAudioState, setActiveAudioState] = useAtom(activeAudioDataState);

  const onModalClose = () => {
    setActiveAudioState(null);
    activeAudioState?.wavesurfer?.destroy();
  };

  useEffect(() => {
    if (typeof activeAudioState?.chapterNo === "number")
      Promise.all([
        getSurahAudio({ recitationId: 2, chapterNo: activeAudioState?.chapterNo }),
        getChapterVerses({ chapterNo: activeAudioState?.chapterNo }),
      ])
        .then(([recitationForChapter, chapterVerses]) => {
          const wavesurferDivWrapper = document.getElementById("wavesurfer-wrapper")!;
          wavesurferDivWrapper.innerHTML = "";
          if (activeAudioState.wavesurfer) activeAudioState.wavesurfer.destroy();

          const wavesurfer = WaveSurfer.create({
            container: wavesurferDivWrapper,
            waveColor: "green",
            progressColor: "lightgreen",
            cursorColor: "whitesmoke",
            barWidth: 12,
            barRadius: 60,
            height: 500,
            barHeight: 2,
            interact: false,
            cursorWidth: 0.1,
            mediaControls: true,
            pixelRatio: 10,
            responsive: true,
            autoCenter: true,
            hideScrollbar: true,
          });

          wavesurfer.load(recitationForChapter?.audio_file.audio_url);

          wavesurfer.on("ready", () => wavesurfer.play());

          wavesurfer.on("audioprocess", e => {
            const progressPercentage = e / wavesurfer.getDuration();

            wavesurferDivWrapper.scrollLeft =
              wavesurferDivWrapper.scrollWidth * progressPercentage;
            // - wavesurferDivWrapper.clientWidth * 0.05;
          });

          setActiveAudioState({
            wavesurfer,
            chapterNo: activeAudioState?.chapterNo,
            expandedPlayer: true,
          });
        })
        .catch(err => {
          toast({
            title: "Ooops!",
            status: "error",
            isClosable: false,
            description: `Error:- ${err.message ? err.message : JSON.stringify(err)}`,
            position: "bottom-left",
          });

          setTimeout(() => {
            navigate("/quran-recitation");
          }, 3000);
        });

    return () => {
      activeAudioState?.wavesurfer?.destroy();
    };
  }, [activeAudioState?.chapterNo]);

  return (
    <Box
      h={activeAudioState?.expandedPlayer ? "full" : "32"}
      w={activeAudioState?.expandedPlayer ? "full" : "95%"}
      m="auto"
      opacity={typeof activeAudioState?.chapterNo === "number" ? 1 : 0}
      pointerEvents={typeof activeAudioState?.chapterNo === "number" ? "auto" : "none"}
      p={3}
      bg="#031b13"
      pos="fixed"
      zIndex={90}
      bottom={0}
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
          {activeAudioState?.expandedPlayer ? <BsChevronDown /> : <BsChevronUp />}
        </IconButton>
        <Spacer />
        <IconButton onClick={onModalClose} colorScheme="gray" aria-label={"button"}>
          <IoMdClose />
        </IconButton>
      </Flex>

      <Collapse animateOpacity in={activeAudioState?.expandedPlayer}>
        <Box
          id="wavesurfer-wrapper"
          h="500px"
          display="grid"
          placeItems="center"
          scale={5}
          w="full"
          overflowX="scroll"
          overflowY="hidden"
        ></Box>
      </Collapse>
    </Box>
  );
}

export default ViewChapter;
