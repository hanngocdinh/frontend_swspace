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

const ContentArea = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const DateSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const CalendarContainer = styled.div`
  margin-bottom: 2rem;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #45bf55;
  }
`;

const TimeSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimeInputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeLabel = styled.label`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TimeInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #45bf55;
  }
`;

const WarningMessage = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const DurationInfo = styled.div`
  background: #e8f5e8;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const DurationText = styled.p`
  margin: 0;
  color: #27ae60;
  font-weight: 600;
`;

const PriceInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
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

const DateSelectionPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [validationMessage, setValidationMessage] = useState('');
  const [validationType, setValidationType] = useState(''); // 'warning', 'error', 'success'
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedService, selectedPackage, customHours } = location.state || {};

  useEffect(() => {
    if (!selectedService || !selectedPackage) {
      navigate('/team-booking');
      return;
    }
    
    validateDate();
  }, [selectedDate, selectedService, selectedPackage, navigate]);

  const validateDate = () => {
    if (!selectedDate) {
      setValidationMessage('');
      setValidationType('');
      return;
    }

    const today = new Date();
    const bookingDate = new Date(selectedDate);
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const minAdvanceDays = selectedService.minimumBookingAdvance === '1 week' ? 7 : 1;

    if (diffDays < 0) {
      setValidationMessage('Cannot book for past dates');
      setValidationType('error');
    } else if (diffDays < minAdvanceDays) {
      setValidationMessage(`This service requires minimum ${selectedService.minimumBookingAdvance} advance booking`);
      setValidationType('error');
    } else if (diffDays === minAdvanceDays) {
      setValidationMessage('You are booking at the minimum advance time');
      setValidationType('warning');
    } else {
      setValidationMessage('Date is available for booking');
      setValidationType('success');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDurationText = (duration) => {
    const { value, unit } = duration;
    const unitMap = {
      hours: 'giờ',
      days: 'ngày', 
      months: 'tháng',
      years: 'năm'
    };
    return `${value} ${unitMap[unit]}`;
  };

  const calculateFinalPrice = () => {
    if (selectedPackage.isCustom && customHours) {
      return selectedPackage.pricePerUnit * customHours;
    }
    return selectedPackage.price;
  };

  const getMinDate = () => {
    const today = new Date();
    const minAdvanceDays = selectedService.minimumBookingAdvance === '1 week' ? 7 : 1;
    const minDate = new Date(today.getTime() + (minAdvanceDays * 24 * 60 * 60 * 1000));
    return minDate.toISOString().split('T')[0];
  };

  const handleContinue = () => {
    if (validationType === 'error' || !selectedDate) {
      return;
    }

    // Calculate end date for longer packages
    let endDate = selectedDate;
    if (selectedPackage.duration.unit === 'months' || selectedPackage.duration.unit === 'years') {
      const start = new Date(selectedDate);
      if (selectedPackage.duration.unit === 'months') {
        start.setMonth(start.getMonth() + selectedPackage.duration.value);
      } else {
        start.setFullYear(start.getFullYear() + selectedPackage.duration.value);
      }
      endDate = start.toISOString().split('T')[0];
    }

    navigate('/team-booking/rooms', {
      state: {
        selectedService,
        selectedPackage,
        customHours,
        startDate: selectedDate,
        endDate,
        startTime,
        endTime
      }
    });
  };

  if (!selectedService || !selectedPackage) {
    return null;
  }

  return (
    <>
      <Header />
      <Container>
        <BackButton onClick={() => navigate('/team-booking/duration', { 
          state: { selectedService } 
        })}>
          ← Back to Packages
        </BackButton>
        
        <HeaderSection>
          <Title>Select Your <span>Date & Time</span></Title>
          
          <BookingInfo>
            <InfoCard>
              <InfoLabel>Service:</InfoLabel>
              <InfoValue>{selectedService.name}</InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>Package:</InfoLabel>
              <InfoValue>
                {selectedPackage.name}
                {customHours && ` (${customHours} hours)`}
              </InfoValue>
            </InfoCard>
            <InfoCard>
              <InfoLabel>Advance Required:</InfoLabel>
              <InfoValue>{selectedService.minimumBookingAdvance}</InfoValue>
            </InfoCard>
          </BookingInfo>
        </HeaderSection>

      <ContentArea>
        <DateSection>
          <SectionTitle>Booking Date</SectionTitle>
          
          <CalendarContainer>
            <DateInput
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
            />
          </CalendarContainer>

          {validationMessage && (
            <>
              {validationType === 'warning' && (
                <WarningMessage>{validationMessage}</WarningMessage>
              )}
              {validationType === 'error' && (
                <ErrorMessage>{validationMessage}</ErrorMessage>
              )}
              {validationType === 'success' && (
                <SuccessMessage>{validationMessage}</SuccessMessage>
              )}
            </>
          )}

          {(selectedService.name === 'Meeting Room' || selectedService.name === 'Networking Space') && (
            <>
              <SectionTitle>Time Schedule</SectionTitle>
              <TimeSection>
                <TimeInputGroup>
                  <TimeLabel>Start Time</TimeLabel>
                  <TimeInput
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </TimeInputGroup>
                <TimeInputGroup>
                  <TimeLabel>End Time</TimeLabel>
                  <TimeInput
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </TimeInputGroup>
              </TimeSection>
            </>
          )}

          <DurationInfo>
            <DurationText>
              Duration: {selectedPackage.isCustom && customHours 
                ? `${customHours} hours` 
                : getDurationText(selectedPackage.duration)
              }
            </DurationText>
          </DurationInfo>

          <PriceInfo>
            <PriceLabel>Total Price</PriceLabel>
            <FinalPrice>{formatPrice(calculateFinalPrice())}</FinalPrice>
          </PriceInfo>

          <ContinueButton
            onClick={handleContinue}
            disabled={validationType === 'error' || !selectedDate}
          >
            Continue to Room Selection
          </ContinueButton>
        </DateSection>
      </ContentArea>
    </Container>
    <Footer />
    </>
  );
};

export default DateSelectionPage;