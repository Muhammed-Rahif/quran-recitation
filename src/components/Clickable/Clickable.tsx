import React from "react";
import { useClickable, UseClickableProps } from "@chakra-ui/clickable";
import { chakra } from "@chakra-ui/react";

function Clickable(props?: UseClickableProps) {
  const clickable = useClickable(props);

  return <chakra.div {...clickable} />;
}

export default Clickable;
