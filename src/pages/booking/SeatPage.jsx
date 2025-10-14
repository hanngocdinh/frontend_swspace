import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import BookingLayout from './BookingLayout';

const SeatTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
`;

const SeatTitleText = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const FloorIndicator = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: #45bf55;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const SeatSelectionInfo = styled.div`
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }
`;

const InfoLabel = styled.div`
  font-weight: 500;
  width: 150px;
  
  @media (max-width: 480px) {
    width: 120px;
  }
`;

const InfoValue = styled.div`
  flex: 1;
`;

const SeatmapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const SeatmapImage = styled.div`
  position: relative;
  max-width: 100%;
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const SeatLegend = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.color};
  
  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }
`;

const SeatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.5rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 600px;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 0.4rem;
    margin-top: 1.5rem;
  }
`;

const SeatItem = styled.div`
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: ${props => props.available ? 'pointer' : 'default'};
  background-color: ${props => {
    if (props.selected) return '#45bf55';
    if (props.reserved) return '#3498db';
    if (props.occupied) return '#e74c3c';
    return '#f5f5f5';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.selected || props.reserved || props.occupied ? 'white' : '#333'};
  font-size: 0.8rem;
  font-weight: bold;
  opacity: ${props => props.available ? 1 : 0.6};
  transition: all 0.2s;
  
  &:hover {
    ${props => props.available && !props.selected && `
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    `}
  }
`;

const BookingSummary = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding-top: 0.8rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 1.25rem;
    padding-top: 0.7rem;
  }
`;

const SummaryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const SummaryValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const TotalAmount = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    margin-top: 1.25rem;
  }
`;

const BackButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
    width: 100%;
    max-width: 200px;
  }
`;

const NextButton = styled.button`
  background-color: #45bf55;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  
  &:hover {
    background-color: #38a046;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
    width: 100%;
    max-width: 200px;
    order: -1; /* Make the Next button appear before the Back button on mobile */
  }
`;

const SeatPage = () => {
  const { bookingState, selectSeat } = useBooking();
  const navigate = useNavigate();
  
  // Redirect if previous steps are not completed
  useEffect(() => {
    if (!bookingState.serviceType || !bookingState.packageDuration || !bookingState.date) {
      navigate('/booking/service');
    }
  }, [bookingState.serviceType, bookingState.packageDuration, bookingState.date, navigate]);
  
  // Get seats based on selected service type
  const seatsForPackage = bookingState.seats[bookingState.serviceType] || [];
  
  // Handle seat selection
  const handleSeatSelect = (seat) => {
    if (seat.available) {
      selectSeat(seat);
    }
  };
  
  // Handle navigation
  const handleNextStep = () => {
    navigate('/booking/payment');
  };
  
  const handleBackStep = () => {
    navigate('/booking/date');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };
  
  return (
    <BookingLayout
      title="Select Your Seat"
      subtitle="Choose your preferred workspace location"
    >
      <SeatSelectionInfo>
        <InfoRow>
          <InfoLabel>Service:</InfoLabel>
          <InfoValue>{bookingState.serviceType === 'hot-desk' ? 'Hot Desk' : 'Fixed Desk'}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Duration:</InfoLabel>
          <InfoValue>
            {bookingState.packageDuration === 'daily' && 'Daily'}
            {bookingState.packageDuration === 'weekly' && 'Weekly'}
            {bookingState.packageDuration === 'monthly' && 'Monthly'}
            {bookingState.packageDuration === 'yearly' && 'Yearly'}
          </InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Date & Time:</InfoLabel>
          <InfoValue>{formatDate(bookingState.date)}</InfoValue>
        </InfoRow>
      </SeatSelectionInfo>
      
      <SeatmapContainer>
        <SeatTitle>
          <SeatTitleText>Select a seat from the available options</SeatTitleText>
          <FloorIndicator>Floor 1</FloorIndicator>
        </SeatTitle>
        
        <SeatmapImage>
          <img 
            src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1760474263/office-floor-plan_tqrrnv.png" 
            alt="Seatmap" 
          />
        </SeatmapImage>
        
        <SeatLegend>
          <LegendItem>
            <LegendColor color="#e74c3c" />
            <span>Occupied</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#3498db" />
            <span>Reserved</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#f5f5f5" />
            <span>Available</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#45bf55" />
            <span>Selected</span>
          </LegendItem>
        </SeatLegend>
        
        <SeatsGrid>
          {seatsForPackage.map((seat) => (
            <SeatItem
              key={seat.id}
              available={seat.available}
              occupied={!seat.available}
              selected={bookingState.selectedSeat && bookingState.selectedSeat.id === seat.id}
              onClick={() => handleSeatSelect(seat)}
            >
              {seat.name}
            </SeatItem>
          ))}
        </SeatsGrid>
      </SeatmapContainer>
      
      {bookingState.selectedSeat && (
        <BookingSummary>
          <SummaryInfo>
            <SummaryLabel>SEAT SELECTED</SummaryLabel>
            <SummaryValue>{bookingState.selectedSeat.name}</SummaryValue>
          </SummaryInfo>
        </BookingSummary>
      )}
      
      <ActionContainer>
        <BackButton onClick={handleBackStep}>
          Back
        </BackButton>
        <NextButton 
          disabled={!bookingState.selectedSeat}
          onClick={handleNextStep}
        >
          Next Step
        </NextButton>
      </ActionContainer>
    </BookingLayout>
  );
};

export default SeatPage;