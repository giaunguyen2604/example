
import './App.css';
import {
  Flex,
  Heading,
  PrimaryButton,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from "styled-components";

function App() {
  const theme = "light";
  return (
    <ThemeProvider theme={lightTheme}>
    <Flex container layout="fill-space-centered">
      <Flex mb="2rem" mr={{ md: '2rem' }} px="1rem">
        <Heading level={4} tag="h1" mb={2}>
          Meeting information
        </Heading>
      </Flex>
    </Flex>
    </ThemeProvider>
  );
}

export default App;
