import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BookingLayout from './BookingLayout';
import { useBooking } from '../../contexts/BookingContext';

const DurationOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.2rem;
    justify-content: space-around;
  }
`;

const DurationCard = styled.div`
  width: 250px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
  
  ${props => props.selected && `
    border: 2px solid #45bf55;
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 220px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 300px;
  }
`;

const DurationHeader = styled.div`
  padding: 1.2rem;
  background-color: #f8f9fa;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const DurationTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const DurationContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const DurationPrice = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const OriginalPrice = styled.div`
  font-size: 1rem;
  color: #777;
  text-decoration: ${props => props.hasDiscount ? 'line-through' : 'none'};
  margin-bottom: 0.25rem;
`;

const DiscountedPrice = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #45bf55;
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const DurationFeatures = styled.ul`
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    padding-left: 1.25rem;
    margin: 1.25rem 0;
  }
`;

const Feature = styled.li`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const DiscountLabel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: bold;
  border-bottom-left-radius: 8px;
`;

const SelectedMark = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #45bf55;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
`;

const ValidationMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  min-height: 20px; /* Reserve space for validation message */
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    margin-top: 2.5rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    margin-top: 2rem;
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

const PackageDurationPage = () => {
  const { bookingState, selectPackageDuration } = useBooking();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState('');
  
  // Redirect if service type is not selected
  useEffect(() => {
    if (!bookingState.serviceType) {
      navigate('/booking/service');
    }
  }, [bookingState.serviceType, navigate]);
  
  // Tính giá tiền dựa trên loại dịch vụ
  const basePrice = bookingState.serviceType === 'hot-desk' ? 2350000 : 2950000;
  
  // Các gói thời gian
  const durationOptions = [
    {
      id: 'daily',
      title: 'Daily',
      basePrice: basePrice / 30, // Giá theo ngày (chia cho 30 ngày trong tháng)
      discount: 0,
      features: [
        'Access during business hours',
        'Wi-Fi and utilities included',
        'Best for occasional use'
      ]
    },
    {
      id: 'weekly',
      title: 'Weekly',
      basePrice: basePrice / 4, // Giá theo tuần (chia cho 4 tuần trong tháng)
      discount: 0.05, // 5% discount
      features: [
        '7 consecutive days access',
        'Wi-Fi and utilities included',
        'Access to community events',
        '5% discount from daily rate'
      ]
    },
    {
      id: 'monthly',
      title: 'Monthly',
      basePrice: basePrice,
      discount: 0.1, // 10% discount
      features: [
        '30 days access',
        'Wi-Fi and utilities included',
        'Access to community events',
        'Free 4 hours meeting room',
        '10% discount from daily rate'
      ]
    },
    {
      id: 'yearly',
      title: 'Yearly',
      basePrice: basePrice * 12, // Giá theo năm
      discount: 0.15, // 15% discount
      features: [
        '365 days access',
        'Wi-Fi and utilities included',
        'Access to community events',
        'Free 10 hours meeting room monthly',
        'Dedicated locker',
        '15% discount from monthly rate'
      ]
    }
  ];
  
  const handleSelectDuration = (durationId) => {
    selectPackageDuration(durationId);
    setValidationError('');
  };
  
  const handleNextStep = () => {
    if (!bookingState.packageDuration) {
      setValidationError('Please select a duration package to continue.');
      return;
    }
    
    navigate('/booking/date');
  };
  
  const handleBackStep = () => {
    navigate('/booking/service');
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <BookingLayout
      title="Select Your Package Duration"
      subtitle="Choose how long you would like to use the workspace"
    >
      <DurationOptions>
        {durationOptions.map((duration) => {
          const discountedPrice = duration.basePrice * (1 - duration.discount);
          return (
            <DurationCard
              key={duration.id}
              selected={bookingState.packageDuration === duration.id}
              onClick={() => handleSelectDuration(duration.id)}
            >
              {duration.discount > 0 && (
                <DiscountLabel>Save {duration.discount * 100}%</DiscountLabel>
              )}
              
              {bookingState.packageDuration === duration.id && <SelectedMark>✓</SelectedMark>}
              
              <DurationHeader>
                <DurationTitle>{duration.title}</DurationTitle>
              </DurationHeader>
              
              <DurationContent>
                <DurationPrice>
                  {duration.discount > 0 && (
                    <OriginalPrice hasDiscount={true}>
                      {formatCurrency(duration.basePrice)}
                    </OriginalPrice>
                  )}
                  <DiscountedPrice>{formatCurrency(discountedPrice)}</DiscountedPrice>
                </DurationPrice>
                
                <DurationFeatures>
                  {duration.features.map((feature, index) => (
                    <Feature key={index}>{feature}</Feature>
                  ))}
                </DurationFeatures>
              </DurationContent>
            </DurationCard>
          );
        })}
      </DurationOptions>
      
      <ValidationMessage>{validationError}</ValidationMessage>
      
      <ActionContainer>
        <BackButton onClick={handleBackStep}>
          Back
        </BackButton>
        <NextButton onClick={handleNextStep}>
          Next Step
        </NextButton>
      </ActionContainer>
    </BookingLayout>
  );
};

export default PackageDurationPage;