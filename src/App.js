import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import Scheduler from './components/Scheduler';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Scheduler />
    </ChakraProvider>
  );
}

export default App;
