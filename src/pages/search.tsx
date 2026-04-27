import { useRouter } from 'next/router';
import { Box, Text } from '@components';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const searchTerm = Array.isArray(query) ? query[0] : query ?? '';

  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Search results
      </Text>
      <Text>
        You searched for: <b>{searchTerm || '(empty)'}</b>
      </Text>
    </Box>
  );
}
