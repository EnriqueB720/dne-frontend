import { Box, Text, CompactSearchBar } from "@components";

export default function Home() {
  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Compact Search Bar example
      </Text>
      <CompactSearchBar />
    </Box>
  );
}
