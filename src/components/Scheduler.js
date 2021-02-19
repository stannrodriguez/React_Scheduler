import React, { useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import TripItem from './TripItem';
import { getTimeWindow } from '../utils/timeUtils';

const data = require('../data/bus-scheduling-input.json');

function Scheduler(props) {
  const [groups, setGroups] = useState({ unselected: data });
  const [initialBus, setInitialBus] = useState('');
  const [targetBus, setTargetBus] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [nextBusNumber, setNextBusNumber] = useState(1);
  const [hasTimeConflict, setHasTimeConflict] = useState(false);

  function handleTripClick(e, item, group) {
    if ('new' in groups && selectedTrip === item) {
      // Unselect current item
      const newGroups = { ...groups };
      delete newGroups['new'];
      setGroups(newGroups);
      setSelectedTrip(null);
    } else {
      // Create a provisional bus when a trip is selected
      setGroups({ ...groups, new: [] });
      setSelectedTrip(item);
      setInitialBus(group);
    }
  }

  function checkTimeConflicts(trip, otherTrips = []) {
    setHasTimeConflict(false); // Initialize to false
    if (!trip) return;

    // We need conditional statements for the 3 cases:
    otherTrips.forEach(otherTrip => {
      // 1) Selected trip starts between the startTime and endTime of the other trip
      const case1 =
        otherTrip.startTime <= trip.startTime &&
        trip.startTime <= otherTrip.endTime;
      // 2) Selected trip starts EARLIER and ends EARLIER than other trip
      const case2 =
        otherTrip.startTime <= trip.endTime &&
        trip.endTime <= otherTrip.endTime;
      // 3) Selected trip starts EARLIER and ends LATER than other trip
      const case3 =
        trip.startTime <= otherTrip.startTime &&
        otherTrip.endTime <= trip.endTime;

      if (case1 || case2 || case3) {
        setHasTimeConflict(true);
        return;
      }
    });
  }

  function assignTripToBus() {
    // Early exit if there are time conflicts or trip is not moved
    if (hasTimeConflict || initialBus === targetBus) return;

    let newGroups = { ...groups };
    if ('new' in groups && targetBus === 'new') {
      // Create number for new bus & add trip to this bus
      delete newGroups['new'];
      newGroups = { ...newGroups, [`${nextBusNumber}`]: [selectedTrip] };
      setNextBusNumber(x => x + 1);
    } else {
      // Add trip to existing bus
      newGroups = {
        ...newGroups,
        [`${targetBus}`]: [...newGroups[targetBus], selectedTrip],
      };
    }

    // Delete trip from former bus
    newGroups[initialBus] = newGroups[initialBus].filter(
      trip => trip !== selectedTrip
    );

    // Delete any empty buses
    Object.keys(newGroups).forEach(key => {
      if (newGroups[key].length === 0) delete newGroups[key];
    });

    setGroups(newGroups); // Update new groups
    setSelectedTrip(null); // Unselect current trip
    setHasTimeConflict(false);
  }

  function renderAvailableTrips() {
    if (groups['unselected']) {
      return (
        <div>
          <b>Available Trips</b>
          {groups['unselected'].map(item => (
            <TripItem
              {...item}
              handleClick={e => handleTripClick(e, item, 'unselected')}
              position={'relative'}
              bg={item === selectedTrip ? 'purple.400' : 'gray.400'}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <Box w="100%" p={4}>
      {renderAvailableTrips()}

      {Object.entries(groups)
        .filter(([group, trips]) => group !== 'unselected')
        .map(([group, trips], index) => (
          <Box
            minH="70px"
            bg={index % 2 != 0 ? 'gray.200' : 'white'}
            borderColor="gray.300"
            borderBottomWidth={1}
            borderTopWidth={1}
            onMouseEnter={() => {
              setTargetBus(group);
              checkTimeConflicts(selectedTrip, groups[group]);
            }}
            onClick={selectedTrip ? assignTripToBus : null}
          >
            <b>Bus {group}</b> &nbsp; &nbsp;
            {group !== 'New Bus' && getTimeWindow(trips)}
            {trips.map(item => (
              <TripItem
                {...item}
                handleClick={e => handleTripClick(e, item, group)}
                position="absolute"
                bg={item === selectedTrip ? 'purple.400' : 'gray.400'}
              />
            ))}
          </Box>
        ))}

      {hasTimeConflict && (
        <Box color="red"> Time Conflict: Please choose a different bus </Box>
      )}
    </Box>
  );
}

export default Scheduler;
