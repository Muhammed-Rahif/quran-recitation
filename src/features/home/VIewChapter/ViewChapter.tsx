import {
  Box,
  Circle,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRecitations,
  getChapterVerses,
  getSurahAudio,
} from "../../../helpers/api";
import { useAtom } from "jotai";
import { activeAudioDataState } from "../../../states/states";
import {
  BsChevronDown,
  BsChevronUp,
  BsPlayFill,
  BsPauseFill,
  BsVolumeUpFill,
} from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { SurahAudio } from "../../../types/SurahAudio";
import ReactAudioPlayer from "react-audio-player";
import { MdNavigateNext, MdNavigateBefore, MdGraphicEq } from "react-icons/md";
import { AllRecitations } from "../../../types/AllRecitations";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";

function ViewChapter() {
  const toast = useToast();
  const navigate = useNavigate();
  const [activeAudioState, setActiveAudioState] = useAtom(activeAudioDataState);
  const [recitationForChapter, setRecitationForChapter] =
    useState<SurahAudio>();
  const audioPlayerRef = useRef<ReactAudioPlayer | null>();
  const [allRecitations, setAllRecitations] = useState<AllRecitations>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.6);
  const [playerPercentage, setPlayerPercentage] = useState(0);
  const [reciterId, setReciterId] = useState(5);

  const onModalClose = () => {
    setActiveAudioState(null);
  };

  const onNextChapter = () => {
    if (!activeAudioState?.chapterNo) return;
    if (activeAudioState?.chapterNo >= 1 && activeAudioState?.chapterNo < 114)
      setActiveAudioState({
        ...activeAudioState,
        chapterNo: activeAudioState.chapterNo + 1,
      });
  };

  const onPrevChapter = () => {
    if (!activeAudioState?.chapterNo) return;
    if (activeAudioState?.chapterNo > 1 && activeAudioState?.chapterNo <= 114)
      setActiveAudioState({
        ...activeAudioState,
        chapterNo: activeAudioState.chapterNo - 1,
      });
  };

  useEffect(() => {
    if (typeof activeAudioState?.chapterNo === "number")
      Promise.all([
        getSurahAudio({
          recitationId: reciterId,
          chapterNo: activeAudioState?.chapterNo,
        }),
        getChapterVerses({ chapterNo: activeAudioState?.chapterNo }),
        getAllRecitations(),
      ])
        .then(([recitationForChapter, chapterVerses, allRecitations]) => {
          setActiveAudioState({
            chapterNo: activeAudioState?.chapterNo,
            expandedPlayer: activeAudioState.expandedPlayer,
          });
          setRecitationForChapter(recitationForChapter);
          setAllRecitations(allRecitations);
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
  }, [activeAudioState?.chapterNo, reciterId]);

  return (
    <>
      {typeof activeAudioState?.chapterNo === "number" && (
        <Box
          h={activeAudioState?.expandedPlayer ? "full" : { base: 52, md: 40 }}
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
              size="xs"
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
              size="xs"
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
              focusThumbOnChange={false}
              size="lg"
              mb={3}
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
              <SliderThumb boxSize={6}>
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
              volume={audioVolume}
              ref={(audioPlayer) => (audioPlayerRef.current = audioPlayer)}
              crossOrigin="anonymous"
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
            />

            <Flex justify="space-evenly" wrap="wrap">
              <Box
                w={60}
                alignItems="center"
                display={{ base: "none", md: "flex" }}
              >
                <Circle bg="green.600" size="7">
                  <BsVolumeUpFill />
                </Circle>
                <Slider
                  onChange={(value) => {
                    setAudioVolume(value / 100);
                  }}
                  aria-label="audioplayer-volume-slider"
                  value={audioVolume * 100}
                >
                  <SliderTrack bg="red.100">
                    <SliderFilledTrack bg="green.600" />
                  </SliderTrack>
                  <SliderThumb boxSize={5}>
                    <Box color="green.600" as={BsVolumeUpFill} />
                  </SliderThumb>
                </Slider>
              </Box>

              <HStack gap={{ base: 1, md: 3, lg: 3.5, xl: 4 }}>
                <IconButton
                  aria-label="prev-button"
                  borderRadius="full"
                  colorScheme="gray"
                  onClick={onPrevChapter}
                >
                  <TbPlayerTrackPrev />
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

                <IconButton
                  aria-label="next-button"
                  borderRadius="full"
                  colorScheme="gray"
                  onClick={onNextChapter}
                >
                  <TbPlayerTrackNext />
                </IconButton>
              </HStack>

              <Select
                variant="filled"
                placeholder={(() => {
                  const currentRecitation = allRecitations?.recitations.filter(
                    (recite) => recite.id == reciterId
                  );

                  if (currentRecitation)
                    return currentRecitation[0].reciter_name;

                  return "Reciter";
                })()}
                py={{ base: 2, md: 0 }}
                w={{ base: 72, md: 60 }}
                onChange={(e) => setReciterId(parseInt(e.target.value))}
                defaultValue={reciterId}
              >
                {allRecitations?.recitations.map(
                  ({ reciter_name, id }, indx) => (
                    <option value={id} key={indx}>
                      {reciter_name}
                    </option>
                  )
                )}
              </Select>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ViewChapter;
