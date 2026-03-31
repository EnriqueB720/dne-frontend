import { Box, Badge, Avatar, Button, Combobox, Flex, Icon, IconButton, Image, Input, QRCode, Skeleton, SkeletonCircle, SkeletonText, Stack, Text, Textarea } from "@components";

const frameworks = [
  { label: 'React',   value: 'react' },
  { label: 'Vue',     value: 'vue' },
  { label: 'Angular', value: 'angular' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export default function Home(prop: any) {

  return (
    <>
     <p>Index page</p>
     <br />
     Box
     <Box bg="black" color="white" p={4} borderRadius="md">
      pichita
     </Box>
     <br />
     Badge
     <Badge>a</Badge>
     <br />
     Avatar - Lebron
     <Avatar size="xl">
      <Avatar.Fallback />
      <Avatar.Image src="https://media.tenor.com/IuUdckvjNT4AAAAM/i%27ve-played-these-games-before--gin-hun.gif" />
     </Avatar>
     <br />
     Button
      <Button
        colorPalette="blue"
        size="md"
        variant="solid"
        onClick={() => console.log('Button clicked!')}
      >
        Click me - check console
      </Button>
      <br />
      Combobox
      <Combobox items={frameworks}>
        <Combobox.Label>Pick a framework</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input placeholder="Search..." />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger>Clear</Combobox.ClearTrigger>
            <Combobox.Trigger>▼</Combobox.Trigger>
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No results found</Combobox.Empty>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
              {frameworks.map((fw) => (
                <Combobox.Item key={fw.value} item={fw}>
                  {fw.label}
                </Combobox.Item>
              ))}
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox>
      <br />
      Flex
      <Flex gap={4} align="center" justify="space-between" bg="gray.100" p={4}>
        <Box bg="red.300" p={2}>Item 1</Box>
        <Box bg="blue.300" p={2}>Item 2</Box>
        <Box bg="green.300" p={2}>Item 3</Box>
      </Flex>
      <br />
      Icon
      <Flex gap={4} align="center">
        <Icon name="visibilityOn" />
        <Icon name="visibilityOff" />
      </Flex>
      <br />
      IconButton
      <Flex gap={4} align="center">
        <IconButton
          icon="visibilityOn"
          aria-label="Show password"
          variant="ghost"
          size="md"
          onClick={() => console.log('visibilityOn clicked!')}
        />
        <IconButton
          icon="visibilityOff"
          aria-label="Hide password"
          variant="ghost"
          size="md"
          onClick={() => console.log('visibilityOff clicked!')}
        />
      </Flex>
      <br />
      Image - Lebron
      <Image
        src="https://media1.tenor.com/m/lquFMyMh8zYAAAAC/lebron-james-dunk.gif"
        alt="Test image"
        width={500}
        height={300}
        borderRadius="md"
      />
      <br />
      Input
      <Input
        placeholder="Type something..."
        size="md"
        variant="outline"
        onChange={(e) => console.log('Input value:', e.target.value)}
      />
      <br />
      QRCode
      <QRCode value="https://vergemagazine.co.uk/wp-content/uploads/2025/10/Screenshot-2025-10-09-235055-e1760050295687.jpg" size="md">
        <QRCode.Frame>
          <QRCode.Pattern />
        </QRCode.Frame>
      </QRCode>
      <br />
      Skeleton
      <Skeleton height="20px" width="200px" />
      <br />
      SkeletonCircle
      <SkeletonCircle size="10" />
      <br />
      SkeletonText
      <SkeletonText noOfLines={3} gap="2" />
      <br />
      Stack
      <Stack gap={4} bg="gray.100" p={4}>
        <Box bg="red.300" p={2}>Stack Item 1</Box>
        <Box bg="blue.300" p={2}>Stack Item 2</Box>
        <Box bg="green.300" p={2}>Stack Item 3</Box>
      </Stack>
      <br />
      Text
      <Text fontSize="xl" fontWeight="bold" color="blue.500">Hello world</Text>
      <Text fontSize="sm" color="gray.500">Smaller subtle text</Text>
      <br />
      Text Area
      <Textarea
        placeholder="Type something here..."
        size="md"
        variant="outline"
        rows={4}
        onChange={(e) => console.log('Textarea value:', e.target.value)}
      />
      <br />
    </>
  )
}