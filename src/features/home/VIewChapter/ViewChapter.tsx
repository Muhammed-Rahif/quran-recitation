import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getChapterVerses, getSurahAudio } from "../../../helpers/api";
import { useAtom } from "jotai";
import { activeAudioDataState } from "../../../states/states";
import {
  BsChevronDown,
  BsChevronUp,
  BsPlayFill,
  BsPauseFill,
} from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { SurahAudio } from "../../../types/SurahAudio";
import ReactAudioPlayer from "react-audio-player";
import { Wave, AudioElement } from "@foobar404/wave";
import { MdNavigateNext, MdNavigateBefore, MdGraphicEq } from "react-icons/md";

function ViewChapter() {
  const toast = useToast();
  const navigate = useNavigate();
  const [activeAudioState, setActiveAudioState] = useAtom(activeAudioDataState);
  const [recitationForChapter, setRecitationForChapter] =
    useState<SurahAudio>();
  const audioPlayerRef = useRef<ReactAudioPlayer | null>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playerPercentage, setPlayerPercentage] = useState(0);

  const onModalClose = () => {
    setActiveAudioState(null);
  };

  useEffect(() => {
    if (typeof activeAudioState?.chapterNo === "number")
      Promise.all([
        getSurahAudio({
          recitationId: 4,
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

  return (
    <>
      {typeof activeAudioState?.chapterNo === "number" && (
        <Box
          h={activeAudioState?.expandedPlayer ? "full" : "40"}
          w={
            activeAudioState?.expandedPlayer
              ? "full"
              : {
                  base: "xs",
                  sm: "sm",
                  md: "xl",
                  lg: "2xl",
                  xl: "7xl",
                }
          }
          opacity={typeof activeAudioState?.chapterNo === "number" ? 1 : 0}
          pointerEvents={
            typeof activeAudioState?.chapterNo === "number" ? "auto" : "none"
          }
          p={3}
          bg="#031b13"
          pos="fixed"
          zIndex={90}
          bottom={activeAudioState?.expandedPlayer ? 0 : 5}
          borderRadius={activeAudioState?.expandedPlayer ? "none" : "xl"}
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
            {/* <Box
              as="canvas"
              w="full"
              m="auto"
              h={400}
              id="recitation-visulization-canvas"
            /> */}
          </Collapse>

          <Box py={5}>
            <Slider
              value={playerPercentage}
              onChange={(value) => {
                const audio = audioPlayerRef.current?.audioEl.current;
                if (!audio) return;
                audio.currentTime = audio.duration * (value / 100);
              }}
              aria-label="audioplayer-slider"
            >
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="green.600" />
              </SliderTrack>
              <SliderThumb boxSize={5}>
                <Box color="green.600" as={MdGraphicEq} />
              </SliderThumb>
            </Slider>

            <ReactAudioPlayer
              src={recitationForChapter?.audio_file.audio_url}
              autoPlay
              listenInterval={50}
              onListen={() => {
                const audio = audioPlayerRef.current?.audioEl.current;
                if (!audio) return;
                setPlayerPercentage((audio.currentTime / audio.duration) * 100);
              }}
              controls={false}
              style={{
                width: "100%",
                backgroundColor: "green",
                borderRadius: "50px",
              }}
              ref={(audioPlayer) => (audioPlayerRef.current = audioPlayer)}
              crossOrigin="anonymous"
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
              onCanPlay={(e) => console.log(e)}
            />

            <Flex justify="space-evenly">
              <IconButton
                aria-label="prev-button"
                borderRadius="full"
                colorScheme="gray"
                onClick={() => {
                  const audio = audioPlayerRef.current?.audioEl.current;
                  if (!audio) return;
                  audio.currentTime -= 5;
                }}
              >
                <MdNavigateBefore />
              </IconButton>

              <IconButton
                aria-label="play-button"
                colorScheme="green"
                size="lg"
                onClick={() => {
                  const audio = audioPlayerRef.current?.audioEl.current;
                  isAudioPlaying ? audio?.pause() : audio?.play();
                }}
                isRound
              >
                {isAudioPlaying ? (
                  <BsPauseFill size="26" />
                ) : (
                  <BsPlayFill size="26" />
                )}
              </IconButton>

              <IconButton
                aria-label="next-button"
                borderRadius="full"
                colorScheme="gray"
                onClick={() => {
                  const audio = audioPlayerRef.current?.audioEl.current;
                  if (!audio) return;
                  audio.currentTime += 5;
                }}
              >
                <MdNavigateNext />
              </IconButton>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ViewChapter;
