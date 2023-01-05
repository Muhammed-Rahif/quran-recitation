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
    <Modal
      scrollBehavior="inside"
      onClose={onModalClose}
      size="full"
      motionPreset="slideInBottom"
      isOpen={typeof activeAudioState?.chapterNo === "number"}
      colorScheme="green"
      blockScrollOnMount={false}
    >
      {/* <ModalOverlay  /> */}

      <ModalContent
        mx={activeAudioState?.expandedPlayer ? 0 : 4}
        // maxHeight={"12rem"}
        // h={activeAudioState?.expandedPlayer ? "full" : "12rem"}
        maxH={"12rem"}
        bgColor="#031b13"
        p={0}
        top={activeAudioState?.expandedPlayer ? 0 : "80vh"}
      >
        <ModalBody p={activeAudioState?.expandedPlayer ? 3 : 2.5}>
          <Box>
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

            <Collapse in={activeAudioState?.expandedPlayer}>
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
        </ModalBody>

        {/* <ModalFooter>
            <Button onClick={() => setActiveChapterNo(null)}>Close</Button>
          </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}

export default ViewChapter;
