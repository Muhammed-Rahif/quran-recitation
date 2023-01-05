import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChapterVerses } from "../../../types/ChapterVerses";
import { getChapterVerses, getSurahAudio } from "../../../helpers/api";
import WaveSurfer from "wavesurfer.js";
import { SurahAudio } from "../../../types/SurahAudio";
import { useAtom } from "jotai";
import { activeAudioDataState } from "../../../states/states";

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

          const wavesurfer = WaveSurfer.create({
            container: wavesurferDivWrapper,
            waveColor: "green",
            progressColor: "lightgreen",
            cursorColor: "darkgreen",
            barWidth: 2.5,
            barRadius: 12,
            barHeight: 1.5,
            interact: false,
            cursorWidth: 0.2,
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
              wavesurferDivWrapper.scrollWidth * progressPercentage -
              wavesurferDivWrapper.clientWidth * 0.5;
          });

          setActiveAudioState({ wavesurfer, chapterNo: activeAudioState?.chapterNo });
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
    <Modal
      onClose={onModalClose}
      size="6xl"
      motionPreset="slideInBottom"
      isOpen={typeof activeAudioState?.chapterNo === "number"}
      colorScheme="green"
    >
      {/* <ModalOverlay /> */}

      <ModalContent bgColor="#031b13">
        <ModalCloseButton zIndex="99999" />

        <ModalBody>
          <Box>
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
          </Box>
        </ModalBody>

        {/* <ModalFooter>
            <Button onClick={() => setActiveChapterNo(null)}>Close</Button>
          </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}

export default ViewChapter;
