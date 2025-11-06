import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: white;
  border: 2px solid #45bf55;
  color: #45bf55;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #45bf55;
    color: white;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  
  span {
    color: #45bf55;
  }
`;

const BookingInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const InfoValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
`;

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid transparent;
  
  ${props => props.selected && `
    border-color: #45bf55;
    transform: scale(1.02);
  `}
  
  &:hover {
    transform: translateY(-5px) ${props => props.selected ? 'scale(1.02)' : ''};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const RoomImage = styled.div`
  height: 200px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const RoomContent = styled.div`
  padding: 1.5rem;
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RoomName = styled.h3`
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
`;

const RoomNumber = styled.span`
  background: #45bf55;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const RoomDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: #2c3e50;
`;

const FeaturesList = styled.div`
  margin-bottom: 1rem;
`;

const FeatureItem = styled.span`
  display: inline-block;
  background: #e8f5e8;
  color: #27ae60;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
`;

const AmenitiesList = styled.div`
  margin-bottom: 1.5rem;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' 
    : 'linear-gradient(135deg, #45bf55 0%, #38a046 100%)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(69, 191, 85, 0.3);
  }
`;

const ContinueSection = styled.div`
  max-width: 600px;
  margin: 3rem auto 0;
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SelectedRoomInfo = styled.div`
  margin-bottom: 2rem;
`;

const SelectedRoomName = styled.h3`
  color: #45bf55;
  margin-bottom: 0.5rem;
`;

const PriceInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const PriceLabel = styled.div`
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const FinalPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #45bf55;
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #45bf55 0%, #38a046 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(69, 191, 85, 0.3);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #45bf55;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e74c3c;
  font-size: 1.1rem;
  padding: 2rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #7f8c8d;
  font-size: 1.1rem;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 600px;
`;

const RoomSelectionPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedService, selectedPackage, customHours, startDate, endDate, startTime, endTime } = location.state || {};

  useEffect(() => {
    if (!selectedService || !selectedPackage) {
      navigate('/team-booking');
      return;
    }
    fetchAvailableRooms();
  }, [selectedService, selectedPackage, startDate, endDate, navigate]);

  const fetchAvailableRooms = async () => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        startTime,
        endTime
      });

      const response = await fetch(`/api/team/services/${encodeURIComponent(selectedService.name)}/rooms/available?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRooms(data.data);
      } else {
        setError('Failed to load available rooms');
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setError('Failed to load available rooms');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateFinalPrice = () => {
    if (selectedPackage.isCustom && customHours) {
      return selectedPackage.pricePerUnit * customHours;
    }
    return selectedPackage.price;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleContinue = () => {
    if (!selectedRoom) return;

    navigate('/team-booking/payment', {
      state: {
        selectedService,
        selectedPackage,
        selectedRoom,
        customHours,
        startDate,
        endDate,
        startTime,
        endTime
      }
    });
  };

  if (!selectedService || !selectedPackage) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <BackButton onClick={() => navigate('/team-booking/date', { 
          state: { selectedService, selectedPackage, customHours } 
        })}>
          ← Back to Date Selection
        </BackButton>
        
        <HeaderSection>
          <Title>Select Your <span>Room</span></Title>
        
        <BookingInfo>
          <InfoCard>
            <InfoLabel>Service:</InfoLabel>
            <InfoValue>{selectedService.name}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Date:</InfoLabel>
            <InfoValue>{formatDate(startDate)}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Time:</InfoLabel>
            <InfoValue>{startTime} - {endTime}</InfoValue>
          </InfoCard>
        </BookingInfo>
        </HeaderSection>

      {rooms.length === 0 ? (
        <EmptyMessage>
          No rooms available for the selected date and time. Please try a different date or time slot.
        </EmptyMessage>
      ) : (
        <>
          <RoomsGrid>
            {rooms.map((room) => (
              <RoomCard 
                key={room._id} 
                selected={selectedRoom?._id === room._id}
                onClick={() => handleRoomSelect(room)}
              >
                <RoomImage image={room.images?.[0] || selectedService.image} />
                <RoomContent>
                  <RoomHeader>
                    <RoomName>{room.name}</RoomName>
                    <RoomNumber>{room.roomNumber}</RoomNumber>
                  </RoomHeader>
                  
                  <RoomDetails>
                    <DetailItem>
                      <DetailLabel>Floor</DetailLabel>
                      <DetailValue>{room.floor}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Capacity</DetailLabel>
                      <DetailValue>{room.capacity} people</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Area</DetailLabel>
                      <DetailValue>{room.area} m²</DetailValue>
                    </DetailItem>
                  </RoomDetails>

                  <FeaturesList>
                    {room.features.map((feature, index) => (
                      <FeatureItem key={index}>{feature}</FeatureItem>
                    ))}
                  </FeaturesList>

                  <AmenitiesList>
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <AmenityItem key={index}>
                        <span>✓</span>
                        <span>{amenity.name}</span>
                      </AmenityItem>
                    ))}
                  </AmenitiesList>

                  <SelectButton 
                    selected={selectedRoom?._id === room._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomSelect(room);
                    }}
                  >
                    {selectedRoom?._id === room._id ? 'Selected' : 'Select This Room'}
                  </SelectButton>
                </RoomContent>
              </RoomCard>
            ))}
          </RoomsGrid>

          {selectedRoom && (
            <ContinueSection>
              <SelectedRoomInfo>
                <SelectedRoomName>Selected: {selectedRoom.name}</SelectedRoomName>
                <p>Room {selectedRoom.roomNumber} • Floor {selectedRoom.floor} • {selectedRoom.capacity} people</p>
              </SelectedRoomInfo>

              <PriceInfo>
                <PriceLabel>Total Price</PriceLabel>
                <FinalPrice>{formatPrice(calculateFinalPrice())}</FinalPrice>
              </PriceInfo>

              <ContinueButton onClick={handleContinue}>
                Continue to Payment
              </ContinueButton>
            </ContinueSection>
          )}
        </>
      )}
    </Container>
    <Footer />
    </>
  );
};

export default RoomSelectionPage;