import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useBooking } from '../../contexts/BookingContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Space for fixed header */
`;

const SectionContainer = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const BookingHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const BookingTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const BookingSubtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e0e0e0;
    z-index: 1;
    transform: translateY(-50%);
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#45bf55' : '#e0e0e0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StepLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.active ? '#333' : '#999'};
  text-align: center;
`;

const SeatMapContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem auto;
`;

const SeatSelectionInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
`;

const InfoLabel = styled.div`
  font-weight: 500;
  width: 150px;
`;

const InfoValue = styled.div`
  flex: 1;
`;

const MapContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MapTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SeatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 0 auto;
  max-width: 600px;
`;

const Seat = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  background-color: ${props => 
    props.selected ? '#45bf55' :
    props.available ? '#f5f5f5' : '#e0e0e0'
  };
  color: ${props => props.selected ? 'white' : '#333'};
  font-weight: 500;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    border-color: ${props => props.available ? '#45bf55' : 'transparent'};
    transform: ${props => props.available ? 'translateY(-2px)' : 'none'};
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
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
`;

const SeatMapPage = () => {
  const { bookingState, selectSeat } = useBooking();
  const navigate = useNavigate();
  
  // Redirect if previous steps are not completed
  if (!bookingState.serviceType || !bookingState.packageType || !bookingState.date) {
    navigate('/booking/service');
    return null;
  }
  
  const seatsForPackage = bookingState.seats[bookingState.packageType] || [];
  
  const handleSeatSelect = (seat) => {
    if (seat.available) {
      selectSeat(seat);
    }
  };
  
  const handleNextStep = () => {
    navigate('/booking/confirmation');
  };
  
  const handleBackStep = () => {
    navigate('/booking/date');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <SectionContainer>
          <BookingHeader>
            <BookingTitle>Select Your Seat</BookingTitle>
            <BookingSubtitle>Choose your preferred workspace location</BookingSubtitle>
          </BookingHeader>
          
          <StepsContainer>
            <Step>
              <StepCircle active={true}>1</StepCircle>
              <StepLabel active={true}>Service</StepLabel>
            </Step>
            <Step>
              <StepCircle active={true}>2</StepCircle>
              <StepLabel active={true}>Package</StepLabel>
            </Step>
            <Step>
              <StepCircle active={true}>3</StepCircle>
              <StepLabel active={true}>Date</StepLabel>
            </Step>
            <Step>
              <StepCircle active={true}>4</StepCircle>
              <StepLabel active={true}>Seat</StepLabel>
            </Step>
            <Step>
              <StepCircle active={false}>5</StepCircle>
              <StepLabel active={false}>Booking</StepLabel>
            </Step>
          </StepsContainer>
          
          <SeatMapContainer>
            <SeatSelectionInfo>
              <InfoRow>
                <InfoLabel>Service Type:</InfoLabel>
                <InfoValue>{bookingState.serviceType === 'freelancer' ? 'Freelancer' : 'Team'}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Package:</InfoLabel>
                <InfoValue>
                  {bookingState.packageType === 'hot-desk' ? 'Hot Desk' : 'Fixed Desk'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Date & Time:</InfoLabel>
                <InfoValue>{formatDate(bookingState.date)}</InfoValue>
              </InfoRow>
            </SeatSelectionInfo>
            
            <MapContainer>
              <MapTitle>Select a seat from the available options below</MapTitle>
              
              <SeatsGrid>
                {seatsForPackage.map((seat) => (
                  <Seat
                    key={seat.id}
                    available={seat.available}
                    selected={bookingState.selectedSeat && bookingState.selectedSeat.id === seat.id}
                    onClick={() => handleSeatSelect(seat)}
                  >
                    {seat.name}
                  </Seat>
                ))}
              </SeatsGrid>
              
              <Legend>
                <LegendItem>
                  <LegendColor color="#f5f5f5" />
                  <span>Available</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor color="#e0e0e0" />
                  <span>Unavailable</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor color="#45bf55" />
                  <span>Selected</span>
                </LegendItem>
              </Legend>
            </MapContainer>
            
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
          </SeatMapContainer>
        </SectionContainer>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default SeatMapPage;