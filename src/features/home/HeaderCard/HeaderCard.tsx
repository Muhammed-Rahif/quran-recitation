import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Collapse,
  Divider,
  Flex,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function HeaderCard() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.onscroll = e => {
      if (window.scrollY !== 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
  }, []);

  return (
    <LinkBox pos="sticky" top={4} borderRadius="2xl" zIndex={60}>
      <Card
        shadow={isScrolled ? "dark-lg" : "base"}
        pos="relative"
        bg="green.700"
        my={isScrolled ? 1.5 : 4}
        borderRadius="2xl"
      >
        <CardBody pos="relative" zIndex={1} py={isScrolled ? 2 : 3}>
          <Text mb={isScrolled ? 1 : 2} fontSize="xs">
            Last Read
          </Text>

          <Box my={isScrolled ? 1.5 : 3}>
            <Flex align="center">
              <Heading transition="font-size 500ms" size={isScrolled ? "md" : "xl"}>
                <LinkOverlay as={Link} to="/">
                  Al-Fatihah
                </LinkOverlay>
              </Heading>
              <Spacer />
              <Text fontSize="xs">Makkah</Text>
            </Flex>

            <Collapse in={!isScrolled} animateOpacity>
              <Text>The Opener</Text>
              <Divider my={1.5} />
            </Collapse>
          </Box>

          <Collapse in={!isScrolled} animateOpacity>
            <Text fontSize="sm">Ayah No: 7</Text>
          </Collapse>
        </CardBody>

        <Image
          pos="absolute"
          top="60%"
          right={4}
          w={!isScrolled ? 32 : 16}
          transform="translateY(-50%)"
          src="/images/quran.png"
          alt=""
          zIndex={0}
          opacity={0.25}
          transition="width 500ms"
        />
      </Card>
    </LinkBox>
  );
}

export default HeaderCard;
