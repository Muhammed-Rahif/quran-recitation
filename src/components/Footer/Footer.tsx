import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Link,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { RiInstagramFill, RiGithubFill, RiTwitterFill } from "react-icons/ri";
import { SiGmail } from "react-icons/si";
import { TbSend } from "react-icons/tb";

const iconsBtns = [
  {
    icon: RiGithubFill,
    onClick: () =>
      window.open(
        "https://github.com/Muhammed-Rahif/quran-recitation",
        "_blank"
      ),
  },
  {
    icon: SiGmail,
    onClick: () => window.open("mailto:rahifpalliyalil@gmail.com", "_blank"),
  },
  {
    icon: RiInstagramFill,
    onClick: () =>
      window.open("https://instagram.com/muhammed_rahif_", "_blank"),
  },
  {
    icon: RiTwitterFill,
    onClick: () => window.open("https://twitter.com/Muhammed_Rahif", "_blank"),
  },
];

function Footer() {
  return (
    <Box m={5}>
      <Divider my={6} />

      <Grid
        py={2}
        pt={5}
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          "2xl": "repeat(5, 1fr)",
        }}
        columnGap={6}
        rowGap={8}
      >
        <GridItem>
          <Text className="font-kahlil" fontSize="4xl" fontWeight="bold">
            Quran Recitation
          </Text>

          <HStack mt={1}>
            {iconsBtns.map(({ icon: Icon, onClick }, indx) => (
              <Button
                onClick={onClick}
                w={"12"}
                p={3}
                h={"12"}
                borderRadius="full"
                colorScheme="gray"
                key={indx}
              >
                <Icon size={28} />
              </Button>
            ))}
          </HStack>
        </GridItem>

        <GridItem my={2.5}>
          <VStack align="start">
            <FormLabel>Other Apps</FormLabel>

            <Link display="inline-block" fontWeight="semibold">
              Quran
            </Link>
            <Link display="inline-block" fontWeight="semibold">
              Islamic Quiz
            </Link>
            <Link display="inline-block" fontWeight="semibold">
              Notepad
            </Link>
            <Link display="inline-block" fontWeight="semibold">
              Password Generator
            </Link>
          </VStack>
        </GridItem>

        <GridItem my={2.5}>
          <FormControl>
            <FormLabel>Message me!</FormLabel>
            <Box>
              <Textarea p={2.5} placeholder="Type here..." />
              <FormHelperText lineHeight="5">
                Share your thoughts, suggestions and opinions with me. Also
                please consider including me in your dua. Jazakallah khair...
              </FormHelperText>
            </Box>
            <Button
              float="right"
              rightIcon={<TbSend color="white" />}
              variant="outline"
              colorScheme="gray"
            >
              Send
            </Button>
          </FormControl>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Footer;
