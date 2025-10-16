import React from 'react';
import styled from 'styled-components';

const SeatMapContainer = styled.div`
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const SeatGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
`;

const Seat = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1.1rem;
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
  background-color: ${props => {
    if (props.selected) return '#45bf55';
    if (!props.available) return '#f77';
    if (props.reserved) return '#3498db';
    return '#f5f5f5';
  }};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 2px solid ${props => props.selected ? '#45bf55' : 'transparent'};
  box-shadow: ${props => props.selected ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    transform: ${props => props.available ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.available ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'};
    border-color: ${props => props.available && !props.selected ? '#45bf55' : props.selected ? '#45bf55' : 'transparent'};
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-color: ${props => props.color};
`;

const SeatMapLegacy = ({ seats, selectedSeatId, onSelectSeat }) => {
  return (
    <SeatMapContainer>
      <SeatGridContainer>
        {seats.map(seat => (
          <Seat
            key={seat.id}
            available={seat.available}
            selected={selectedSeatId === seat.id}
            reserved={!seat.available && seat.id.includes('B')} // Just for visual distinction
            onClick={() => seat.available && onSelectSeat(seat)}
          >
            {seat.name}
          </Seat>
        ))}
      </SeatGridContainer>
      
      <Legend>
        <LegendItem>
          <LegendColor color="#f5f5f5" />
          <span>Available</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f77" />
          <span>Occupied</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#3498db" />
          <span>Reserved</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#45bf55" />
          <span>Selected</span>
        </LegendItem>
      </Legend>
    </SeatMapContainer>
  );
};

export default SeatMapLegacy;