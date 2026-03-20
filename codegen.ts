import { CodegenConfig } from "@graphql-codegen/cli";

const API_URL = "http://localhost:5000/graphql";

const config: CodegenConfig = {
  schema: API_URL,
  documents: ["src/**/*.graphql"],
  generates: {
    "./src/shared/generated/graphql-schema.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        withHooks: true,
        withHOC: false, 
        withComponent: false,
      },
    },
  },
  ignoreNoDocuments: false,
};

export default config;
