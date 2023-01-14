import {
  Box,
  Center,
  Collapse,
  Flex,
  Heading,
  HStack,
  IconButton,
  Progress,
  Select,
  Spacer,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRecitations,
  getChapter,
  getChapterVerses,
  getSurahAudio,
  getVersesByChapter,
} from "../../../helpers/api";
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
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { AllRecitations } from "../../../types/AllRecitations";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { GetVersesByChapter } from "../../../types/GetVersesByChapter";
import { VERSUS_BASE_URL } from "../../../constants/api";
import { numsToArabicNums as toArb } from "../../../helpers/helpers";
import { QuranChapter } from "../../../types/QuranChapter";
import ScrollIntoViewIfNeeded from "react-scroll-into-view-if-needed";
import { isWebUri } from "valid-url";
import usePrevious from "../../../hooks/usePrevious";
import Balancer from "react-wrap-balancer";

function ViewChapter() {
  const toast = useToast();
  const navigate = useNavigate();
  const [activeAudioState, setActiveAudioState] = useAtom(activeAudioDataState);
  const [recitationForChapter, setRecitationForChapter] =
    useState<SurahAudio>();
  const audioPlayerRef = useRef<ReactAudioPlayer | null>();
  const [allRecitations, setAllRecitations] = useState<AllRecitations>();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(1);
  const [playerPercentage, setPlayerPercentage] = useState(0);
  const [reciterId, setReciterId] = useState(5);
  const [currentVerseNo, setCurrentVerseNo] = useState(1);
  const [versesByChapter, setVersesByChapter] = useState<GetVersesByChapter>();
  const [chapterInfo, setChapterInfo] = useState<QuranChapter>();
  const [isLoading, setIsLoading] = useState(false);
  const prev = usePrevious({ ...activeAudioState });

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

  const onNextVerse = () => {
    if (currentVerseNo === versesByChapter?.pagination.total_records) {
      // setActiveAudioState({
      //   ...activeAudioState,
      //   chapterNo: undefined,
      //   expandedPlayer: false,
      // });
      return;
    }
    setCurrentVerseNo(currentVerseNo + 1);
  };

  const onPrevVerse = () => {
    if (currentVerseNo <= 1) return;
    setCurrentVerseNo(currentVerseNo - 1);
  };

  useEffect(() => {
    if (typeof activeAudioState?.chapterNo !== "number") return;
    if (prev?.chapterNo !== activeAudioState?.chapterNo) setCurrentVerseNo(1);
    setIsLoading(true);
    Promise.all([
      getSurahAudio({
        recitationId: reciterId,
        chapterNo: activeAudioState?.chapterNo,
      }),
      getChapterVerses({ chapterNo: activeAudioState?.chapterNo }),
      getAllRecitations(),
      getVersesByChapter({
        chapterNo: activeAudioState?.chapterNo,
        recitationId: reciterId,
        perPage: 286, // max verses in a chapter (Surah Baqarah)
      }),
      getChapter(activeAudioState.chapterNo),
    ])
      .then(
        ([
          recitationForChapter,
          chapterVerses,
          allRecitations,
          versesByChapter,
          chapterInfo,
        ]) => {
          setActiveAudioState({
            chapterNo: activeAudioState?.chapterNo,
            expandedPlayer: activeAudioState.expandedPlayer,
          });
          setRecitationForChapter(recitationForChapter);
          setAllRecitations(allRecitations);
          setVersesByChapter(versesByChapter);
          setChapterInfo(chapterInfo);
          setIsLoading(false);
        }
      )
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

  function getAudioSrcForVerse(currentVerseNo: number): string | undefined {
    const verse = versesByChapter?.verses.filter(
      (itm) => itm.verse_number === currentVerseNo
    )[0];
    if (!verse) return;

    const audioUrl = verse.audio.url;

    if (isWebUri(audioUrl)) return audioUrl;

    return VERSUS_BASE_URL + verse.audio.url;
    // else
    //   toast({
    //     title: "Ooops!",
    //     status: "error",
    //     isClosable: false,
    //     description: `Error:- can't find verse ${currentVerseNo} in chapter ${chapterNo}`,
    //     position: "bottom-left",
    //   });
  }

  return (
    <>
      {typeof activeAudioState?.chapterNo === "number" && (
        <Box
          // overflowY={activeAudioState.expandedPlayer ? "scroll" : "hidden"}
          h={
            activeAudioState?.expandedPlayer ? "full" : { base: "44", md: "32" }
          }
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
              onClick={() => {
                setActiveAudioState({
                  ...activeAudioState,
                  expandedPlayer: !activeAudioState?.expandedPlayer,
                });
              }}
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
            <Spacer>
              {isLoading ? (
                <Progress
                  size="xs"
                  w={{ base: 32, md: "68%" }}
                  my={4}
                  mx="auto"
                  isIndeterminate
                />
              ) : (
                <Center>
                  <Heading
                    mx="auto"
                    fontWeight="semibold"
                    fontSize="lg"
                    my={{
                      base: activeAudioState.expandedPlayer ? 2 : 0,
                      md: 3,
                    }}
                  >
                    Surah {chapterInfo?.name_simple} : Ayah {currentVerseNo}
                  </Heading>
                </Center>
              )}
            </Spacer>
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
            <Box
              h="100vh"
              px={4}
              py={56}
              overflowY="scroll"
              className="ayahs-wrapper"
            >
              {isLoading ? (
                <Center>
                  <Spinner size="xl" />
                </Center>
              ) : (
                <>
                  {versesByChapter?.verses.map(
                    (
                      { text_uthmani, translations, verse_number: no },
                      indx
                    ) => (
                      <ScrollIntoViewIfNeeded
                        active={
                          no === currentVerseNo &&
                          activeAudioState.expandedPlayer
                        }
                        options={{ scrollMode: "always", behavior: "smooth" }}
                      >
                        <Box mx="auto" my={14} key={indx} maxW="3xl">
                          <Text
                            align="center"
                            className="font-me-quran"
                            fontSize="xl"
                            mb={1.5}
                            lineHeight="10"
                            lang="ar"
                            transition="all 750ms"
                          >
                            <Text
                              align="center"
                              display="inline-block"
                              className="font-me-quran"
                              mx={1.5}
                              as="span"
                              lang="ar"
                            >
                              {/* {`﴾${toArb(no)}﴿`} */}
                              {/* &#xFD3E; */}﴾{toArb(no)}﴿{/* &#xFD3F; */}
                            </Text>
                            {text_uthmani}
                          </Text>
                          <Text transition="all 750ms" align="center" mt={2}>
                            {translations[0].text.replace(
                              /<\/?[^>]+(>|$)/g,
                              ""
                            )}
                          </Text>
                        </Box>
                      </ScrollIntoViewIfNeeded>
                    )
                  )}
                </>
              )}
            </Box>
          </Collapse>

          <Box
            rounded={activeAudioState.expandedPlayer ? "xl" : "base"}
            shadow={activeAudioState.expandedPlayer ? "lg" : "none"}
            bgColor={
              activeAudioState.expandedPlayer ? "#083626" : "transparent"
            }
            py={activeAudioState.expandedPlayer ? 4 : 2}
            px={activeAudioState.expandedPlayer ? 5 : 0}
            bottom={activeAudioState.expandedPlayer ? 5 : 0}
            pos={activeAudioState.expandedPlayer ? "sticky" : "static"}
          >
            {/* <Slider
              focusThumbOnChange={false}
              size="lg"
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
              <SliderThumb boxSize={3}>
                <Box color="green.600" as={MdGraphicEq} />
              </SliderThumb>
            </Slider> */}

            <ReactAudioPlayer
              src={getAudioSrcForVerse(currentVerseNo)}
              onEnded={onNextVerse}
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
              onError={(e) => {
                toast({
                  title: "Ooops!",
                  status: "error",
                  isClosable: true,
                  duration: 12 * 1000,
                  description: `We are unable to play the audio. Please try again later.`,
                  position: "bottom-left",
                });
              }}
            />

            <Flex
              flexDirection={{ base: "column-reverse", md: "row" }}
              justify="space-evenly"
              align="center"
              wrap={{ base: "wrap", md: "nowrap" }}
            >
              <Box w={60} />
              {/* <Box
                w={60}
                alignItems="center"
                display={{
                  base: activeAudioState.expandedPlayer ? "flex" : "none",
                  md: "flex",
                }}
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
              </Box> */}

              <HStack mx={2} gap={{ base: 1, md: 1, lg: 3.5, xl: 4 }}>
                <Tooltip openDelay={1000} label="Previous Chapter" hasArrow>
                  <IconButton
                    aria-label="prev-button"
                    borderRadius="full"
                    colorScheme="gray"
                    onClick={onPrevChapter}
                    isLoading={isLoading}
                  >
                    <TbPlayerTrackPrev />
                  </IconButton>
                </Tooltip>

                <Tooltip openDelay={1000} label="Previous Verse" hasArrow>
                  <IconButton
                    aria-label="next-button"
                    borderRadius="full"
                    colorScheme="gray"
                    onClick={onPrevVerse}
                    isLoading={isLoading}
                  >
                    <MdNavigateBefore />
                  </IconButton>
                </Tooltip>

                <Tooltip openDelay={1000} label="Play" hasArrow>
                  <IconButton
                    aria-label="play-button"
                    colorScheme="green"
                    size="lg"
                    onClick={() => {
                      const audio = audioPlayerRef.current?.audioEl.current;
                      isAudioPlaying ? audio?.pause() : audio?.play();
                    }}
                    isRound
                    isLoading={isLoading}
                  >
                    {isAudioPlaying ? (
                      <BsPauseFill size="26" />
                    ) : (
                      <BsPlayFill size="26" />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip openDelay={1000} label="Next Verse" hasArrow>
                  <IconButton
                    aria-label="next-button"
                    borderRadius="full"
                    colorScheme="gray"
                    onClick={onNextVerse}
                    isLoading={isLoading}
                  >
                    <MdNavigateNext />
                  </IconButton>
                </Tooltip>

                <Tooltip openDelay={1000} label="Next Chapter" hasArrow>
                  <IconButton
                    aria-label="next-button"
                    borderRadius="full"
                    colorScheme="gray"
                    onClick={onNextChapter}
                    isLoading={isLoading}
                  >
                    <TbPlayerTrackNext />
                  </IconButton>
                </Tooltip>
              </HStack>

              <Tooltip openDelay={1000} label="Select Reciter" hasArrow>
                <Select
                  variant="filled"
                  placeholder={(() => {
                    const currentRecitation =
                      allRecitations?.recitations.filter(
                        (recite) => recite.id === reciterId
                      );

                    if (currentRecitation)
                      return currentRecitation[0].reciter_name;

                    return "Reciter";
                  })()}
                  py={{ base: 2, md: 0 }}
                  w={{
                    base: activeAudioState.expandedPlayer ? "full" : 72,
                    md: 60,
                  }}
                  onChange={(e) => setReciterId(parseInt(e.target.value))}
                  defaultValue={reciterId}
                  my={1.5}
                  size={activeAudioState.expandedPlayer ? "md" : "sm"}
                  rounded="lg"
                >
                  {allRecitations?.recitations.map(
                    ({ reciter_name, id }, indx) => (
                      <option value={id} key={indx}>
                        {reciter_name}
                      </option>
                    )
                  )}
                </Select>
              </Tooltip>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
}

export default ViewChapter;
