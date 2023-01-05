import { Box, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChapterVerses } from "../types/ChapterVerses";
import { getChapterVerses, getRecitationForChapter, getSurahAudio } from "../helpers/api";
import { ChapterRecitations } from "../types/ChapterRecitations";
import WaveSurfer from "wavesurfer.js";
import { SurahAudio } from "../types/SurahAudio";

function ViewChapter() {
  const toast = useToast();
  const { chapterNo } = useParams();
  const navigate = useNavigate();

  const [chapterVerses, setChapterVerses] = useState<ChapterVerses>();
  const [recitationForChapter, setRecitationForChapter] = useState<SurahAudio>();

  useEffect(() => {
    Promise.all([
      getSurahAudio({ recitationId: 2, chapterNo: parseInt(chapterNo!) }),
      getChapterVerses({ chapterNo: parseInt(chapterNo!) }),
    ])
      .then(([recitationForChapter, chapterVerses]) => {
        setChapterVerses(chapterVerses);
        setRecitationForChapter(recitationForChapter);
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
  }, []);

  useEffect(() => {
    if (recitationForChapter?.audio_file.audio_url) {
      const wavesurferDivWrapper = document.getElementById("wavesurfer-wrapper")!;
      wavesurferDivWrapper.innerHTML = "";

      const wavesurfer = WaveSurfer.create({
        container: wavesurferDivWrapper,
        waveColor: "green",
        progressColor: "green",
        barWidth: 2.5,
        barRadius: 12,
        barHeight: 1.5,
        interact: false,
        cursorWidth: 0,
        mediaControls: true,
        pixelRatio: 8,
        responsive: true,
        autoCenter: true,
        hideScrollbar: true,
      });

      wavesurfer.load(recitationForChapter?.audio_file.audio_url);

      wavesurfer.on("ready", e => wavesurfer.play());

      wavesurfer.on("audioprocess", e => {
        const progressPercentage = e / wavesurfer.getDuration();

        wavesurferDivWrapper.scrollLeft =
          wavesurferDivWrapper.scrollWidth * progressPercentage -
          wavesurferDivWrapper.clientWidth * 0.5;
      });
    }
  }, [recitationForChapter]);

  return (
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
  );
}

export default ViewChapter;
