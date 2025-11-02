import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import BookingLayout from './BookingLayout';
import { FaExpandAlt, FaCompressAlt, FaTh, FaMapMarkedAlt, FaCube } from 'react-icons/fa';
import ModernOfficeMap from '../../components/ModernOfficeMap';
import ThreeDViewer from '../../components/ThreeDViewer';
import FloatingTourButton from '../../components/FloatingTourButton';
import SketchfabEmbed from '../../components/SketchfabEmbed';
import TourSection from '../../components/TourSection';

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

const FloorTag = styled.div`
  padding: 0.4rem 1rem;
  border-radius: 4px;
  background-color: #45bf55;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const ViewControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  padding: 0.4rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#333' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#333' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
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
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: ${props => `scale(${props.zoomLevel/100})`};
  transform-origin: top center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
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
  font-size: 0.9rem;
  font-weight: bold;
  opacity: ${props => props.available ? 1 : 0.8};
  transition: all 0.2s;
  border: 2px solid transparent;
  box-shadow: ${props => props.selected ? '0 3px 6px rgba(0,0,0,0.2)' : 'none'};
  
  &:hover {
    ${props => props.available && !props.selected && `
      transform: translateY(-3px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
      border-color: #45bf55;
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
  const [viewMode, setViewMode] = useState('map'); // 'map' hoặc 'grid'
  const [zoomLevel, setZoomLevel] = useState(100); // Mức độ zoom (%)
  const [show3DView, setShow3DView] = useState(false); // State để hiển thị modal xem 3D
  
  // Redirect if previous steps are not completed
  useEffect(() => {
    if (!bookingState.serviceType || !bookingState.packageDuration || !bookingState.date) {
      navigate('/booking/service');
    }
  }, [bookingState.serviceType, bookingState.packageDuration, bookingState.date, navigate]);
  
  // Lấy danh sách chỗ ngồi phù hợp với loại dịch vụ
  const getPackageTypeFromBookingState = () => {
    if (bookingState.serviceType === 'hot-desk') {
      return 'hot-desk';
    } else {
      return 'fixed-desk';
    }
  };
  
  const packageType = getPackageTypeFromBookingState();
  const seatsForPackage = bookingState.seats[packageType] || [];
  
  // Xử lý khi chọn chỗ ngồi
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
          <InfoLabel>Start Date:</InfoLabel>
          <InfoValue>{bookingState.date ? formatDate(bookingState.date) : 'Not selected'}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>Start Time:</InfoLabel>
          <InfoValue>{bookingState.time || 'Not selected'}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>End Date:</InfoLabel>
          <InfoValue>{bookingState.endDate ? formatDate(bookingState.endDate) : 'Not selected'}</InfoValue>
        </InfoRow>
        
        <InfoRow>
          <InfoLabel>End Time:</InfoLabel>
          <InfoValue>{bookingState.endTime || 'Not selected'}</InfoValue>
        </InfoRow>
      </SeatSelectionInfo>
      
      <SeatmapContainer>
        <SeatTitle>
          <SeatTitleText>Select a seat from the available options</SeatTitleText>
          <FloorTag>Floor 1</FloorTag>
        </SeatTitle>
        
        <ViewControls>
          <ControlButtons>
            <ControlButton 
              active={viewMode === 'map'} 
              onClick={() => setViewMode('map')}
            >
              <FaMapMarkedAlt style={{ marginRight: '5px' }} />
              Map View
            </ControlButton>
            <ControlButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FaTh style={{ marginRight: '5px' }} />
              Grid View
            </ControlButton>
            <ControlButton 
              onClick={() => setShow3DView(true)}
              style={{ background: '#4a90e2', color: 'white' }}
            >
              <FaCube style={{ marginRight: '5px' }} />
              3D Tour
            </ControlButton>
          </ControlButtons>
          
          {viewMode === 'map' && (
            <ControlButtons>
              <ControlButton 
                onClick={() => setZoomLevel(Math.max(80, zoomLevel - 10))}
                disabled={zoomLevel <= 80}
              >
                <FaCompressAlt style={{ marginRight: '5px' }} />
                Zoom Out
              </ControlButton>
              <ControlButton 
                onClick={() => setZoomLevel(100)}
              >
                Reset
              </ControlButton>
              <ControlButton 
                onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
                disabled={zoomLevel >= 130}
              >
                <FaExpandAlt style={{ marginRight: '5px' }} />
                Zoom In
              </ControlButton>
            </ControlButtons>
          )}
        </ViewControls>
        
        {viewMode === 'map' && (
          <SeatmapImage zoomLevel={zoomLevel}>
            <ModernOfficeMap 
              seats={seatsForPackage}
              selectedSeatId={bookingState.selectedSeat?.id}
              onSelectSeat={handleSeatSelect}
            />
          </SeatmapImage>
        )}
        
        {viewMode === 'grid' && (
          <>
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
                  reserved={!seat.available && seat.id.includes('B')}
                  selected={bookingState.selectedSeat && bookingState.selectedSeat.id === seat.id}
                  onClick={() => handleSeatSelect(seat)}
                >
                  {seat.name}
                </SeatItem>
              ))}
            </SeatsGrid>
          </>
        )}
      </SeatmapContainer>
      
      {bookingState.selectedSeat && (
        <BookingSummary>
          <SummaryInfo>
            <SummaryLabel>SEAT SELECTED</SummaryLabel>
            <SummaryValue>{bookingState.selectedSeat.name}</SummaryValue>
          </SummaryInfo>
          <SummaryInfo>
            <SummaryLabel>LOCATION</SummaryLabel>
            <SummaryValue>Floor 1, {
              bookingState.selectedSeat.name.startsWith('A') || bookingState.selectedSeat.name.startsWith('B') 
                ? 'North Wing' 
                : 'South Wing'
            }</SummaryValue>
          </SummaryInfo>
        </BookingSummary>
      )}
      
      {/* Phần hiển thị tour 3D có thể mở rộng */}
      <TourSection>
        <SketchfabEmbed />
      </TourSection>
      
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
      
      {/* Modal hiển thị không gian 3D */}
      <ThreeDViewer isOpen={show3DView} onClose={() => setShow3DView(false)} />
      
      {/* Nút nổi để truy cập vào tour 3D từ mọi nơi trên trang */}
      <FloatingTourButton onClick={() => setShow3DView(true)} />
    </BookingLayout>
  );
};

export default SeatPage;