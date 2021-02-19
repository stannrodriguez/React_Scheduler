import React from 'react';
import { Box } from '@chakra-ui/react';

import { HEADER_OFFSET } from '../constants';

function TripItem({ id, startTime, endTime, handleClick, position, bg }) {
  const left = `${startTime + HEADER_OFFSET}px`;
  const width = `${endTime - startTime}px`;

  return (
    <Box position="relative">
      <Box onClick={handleClick} left={left} position={position}>
        <Box p={1} bg={bg} borderRadius={4} textAlign="center" w={width}>
          {id}
        </Box>
      </Box>
    </Box>
  );
}

export default TripItem;
