import { FieldProps } from "@types";
import {
  Box,
  Badge,
  Avatar,
  Button,
  Combobox,
  Flex,
  Form,
  Icon,
  IconButton,
  Image,
  Input,
  QRCode,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  Textarea,
  NavBar,
  Footer,
} from "@components";
import * as yup from "yup";

const frameworks = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
];
//Test Fields
const formFields: FieldProps[] = [
  {
    label: "Name",
    name: "name",
    inputPlaceholder: "Enter your name",
    isRequired: true,
  },
  {
    label: "Email",
    name: "email",
    inputPlaceholder: "Enter your email",
    isRequired: true,
  },
  {
    label: "Password",
    name: "password",
    inputPlaceholder: "Enter your password",
    isRequired: true,
    isPassword: true,
  },
  {
    label: "Phone",
    name: "phone",
    fieldType: "phone",
    inputPlaceholder: "Enter your phone",
    isRequired: true,
    countryFieldName: "phoneCountry",
  },
  {
    label: "Framework",
    name: "framework",
    fieldType: "combobox",
    comboboxItems: frameworks,
    comboboxPlaceholder: "Pick a framework",
    comboboxEmptyText: "No frameworks found",
  },
  {
    label: "Description",
    name: "description",
    fieldType: "textarea",
    inputPlaceholder: "Enter a description",
    isRequired: true,
  },
  {
    label: "Profile Picture",
    name: "profilePicture",
    fieldType: "fileUpload",
    inputPlaceholder: "Drop your image here",
  },
];
//Test yup validation schema and initial values for the form
const formValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("* Password is required"),
  phone: yup.string().required("Phone is required"),
  description: yup.string().required("Description is required"),
  phoneCountry: yup.string(),
  framework: yup.string(),
  profilePicture: yup
    .mixed()
    .required("File is required or too large (max 1MB)")
    .test("fileSize", "File is too large (max 1MB)", (value) => {
      if (!value) return true; // handled by required
      return (value as File).size <= 1024 * 1024; //1MB
    }),
});
//test form initial values
const formInitialValues = {
  name: "Test",
  email: "test@email.com",
  password: "secret123",
  phone: "50660022709",
  phoneCountry: "",
  framework: "react",
  description: "A test description",
};

export default function Home(prop: any) {
  return (
    <>
      <NavBar
        logoVariant="light"
        loggedOutLinks={[
          { label: "Home", href: "/" },
          { label: "Supplier Login", href: "/supplierLogin" },
          { label: "Pricing", href: "/pricing" },
        ]}
        rightLinks={[
          { label: "About", href: "/help" },
          { label: "Contact Us", href: "/contact" },
          { label: "Extra Prop link", href: "/extra" },
        ]}
        containerProps={{ bg: "gray.900", padding: "20px 40px" }}
        linkTextProps={{ color: "white", fontSize: "md", fontWeight: "bold" }}
        logoHeight="50px"
      />
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
      <Avatar
        size="xl"
        src="https://media.tenor.com/IuUdckvjNT4AAAAM/i%27ve-played-these-games-before--gin-hun.gif"
        name="Lebron"
      />
      <br />
      Button
      <p>Index page</p>
      <br />
      Form
      <Box maxW="500px" p={4}>
        <Form
          fields={formFields}
          validationSchema={formValidationSchema}
          formValues={formInitialValues}
          isLoading={false}
          submitButtonText="Register"
          groupings={[2, 1, 1, 1, 1, 1]}
          onSubmit={(values) => console.log("Form submitted:", values)}
        />
      </Box>
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
      <Avatar
        size="xl"
        src="https://media.tenor.com/IuUdckvjNT4AAAAM/i%27ve-played-these-games-before--gin-hun.gif"
        name="Lebron"
      />
      <br />
      Button
      <Button
        colorPalette="blue"
        size="md"
        variant="solid"
        onClick={() => console.log("Button clicked!")}
      >
        Click me - check console
      </Button>
      <br />
      Combobox
      <Combobox
        items={frameworks}
        label="Pick a framework"
        placeholder="Search..."
        emptyText="No results found"
      />
      <br />
      Flex
      <Flex gap={4} align="center" justify="space-between" bg="gray.100" p={4}>
        <Box bg="red.300" p={2}>
          Item 1
        </Box>
        <Box bg="blue.300" p={2}>
          Item 2
        </Box>
        <Box bg="green.300" p={2}>
          Item 3
        </Box>
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
          onClick={() => console.log("visibilityOn clicked!")}
        />
        <IconButton
          icon="visibilityOff"
          aria-label="Hide password"
          variant="ghost"
          size="md"
          onClick={() => console.log("visibilityOff clicked!")}
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
        onChange={(e) => console.log("Input value:", e.target.value)}
      />
      <br />
      QRCode
      <QRCode
        value="https://vergemagazine.co.uk/wp-content/uploads/2025/10/Screenshot-2025-10-09-235055-e1760050295687.jpg"
        size="md"
      />
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
        <Box bg="red.300" p={2}>
          Stack Item 1
        </Box>
        <Box bg="blue.300" p={2}>
          Stack Item 2
        </Box>
        <Box bg="green.300" p={2}>
          Stack Item 3
        </Box>
      </Stack>
      <br />
      Text
      <Text fontSize="xl" fontWeight="bold" color="blue.500">
        Hello world
      </Text>
      <Text fontSize="sm" color="gray.500">
        Smaller subtle text
      </Text>
      <br />
      Text Area
      <Textarea
        placeholder="Type something here..."
        size="md"
        variant="outline"
        rows={4}
        onChange={(e) => console.log("Textarea value:", e.target.value)}
      />
      <br />
      NavBar (Logged In) NavBar (Custom - Logged In)
      <NavBar
        logoVariant="dark"
        isLoggedIn={true}
        onLogout={() => console.log("Logout clicked!")}
        loggedInLinks={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Orders", href: "/orders" },
          { label: "Settings", href: "/settings" },
        ]}
        rightLinks={[{ label: "Help Center", href: "/help" }]}
        containerProps={{ bg: "blue.600", padding: "16px 32px" }}
        linkTextProps={{ color: "white", fontSize: "sm" }}
      />
      <br />
      <Footer
        copyrightText="© 2026 D&E Inc. All rights reserved."
        links={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "About Us", href: "/about" },
        ]}
        containerProps={{
          bg: "gray.100",
          borderTop: "1px solid",
          borderColor: "gray.300",
          padding: "24px 40px",
        }}
        linkTextProps={{ color: "blue.600", fontWeight: "medium" }}
        copyrightTextProps={{ color: "gray.700", fontWeight: "bold" }}
        logoHeight="60px"
      />
    </>
  );
}
