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
      getSurahAudio({ recitationId: 1, chapterNo: parseInt(chapterNo!) }),
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
      const wavesurfer = WaveSurfer.create({
        container: "#wavesurfer-wrapper",
        waveColor: "green",
        progressColor: "purple",
        barWidth: 3,
        barRadius: 6,
      });

      wavesurfer.load(recitationForChapter?.audio_file.audio_url);
    }
  }, [recitationForChapter]);

  return (
    <Box>
      <div id="wavesurfer-wrapper"></div>
    </Box>
  );
}

export default ViewChapter;
