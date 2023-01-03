import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecitationForChapter } from "../helpers/api";

function ViewChapter() {
  const toast = useToast();
  const { chapterNo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRecitationForChapter({ recitationId: 1, chapterNo: parseInt(chapterNo!) })
      .then(data => console.log(data))
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

  return <></>;
}

export default ViewChapter;
