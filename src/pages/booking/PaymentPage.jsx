import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCreditCard, FaUniversity, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import BookingLayout from './BookingLayout';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

const PaymentContainer = styled.div`
  background-color: #fff;
  margin: 1rem 0;
`;

const BookingSummary = styled.div`
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    margin: 1.25rem 0;
  }
`;

const SummaryTitle = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 1.5rem;
  }
`;

const SummaryLabel = styled.div`
  font-weight: 500;
  width: 150px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0.25rem;
  }
`;

const SummaryValue = styled.div`
  flex: 1;
`;

const PriceSummary = styled.div`
  margin-top: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 1.5rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

const TotalRow = styled(PriceRow)`
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid #ddd;
  margin-top: 1rem;
  padding-top: 1rem;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const PaymentMethodTitle = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin: 2rem 0 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin: 1.5rem 0 0.75rem;
  }
`;

const PaymentMethodsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const PaymentMethodCard = styled.div`
  border: 2px solid ${props => props.selected ? '#45bf55' : '#e0e0e0'};
  border-radius: 8px;
  padding: 1.5rem;
  flex: 1;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  background-color: ${props => props.selected ? 'rgba(69, 191, 85, 0.1)' : 'white'};
  
  &:hover {
    border-color: #45bf55;
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    min-width: auto;
  }
`;

const PaymentMethodIcon = styled.div`
  font-size: 1.8rem;
  margin-right: 1rem;
  color: #45bf55;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const PaymentMethodInfo = styled.div``;

const PaymentMethodName = styled.div`
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const PaymentMethodDescription = styled.div`
  font-size: 0.8rem;
  color: #666;
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

const PayButton = styled.button`
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
    order: -1; /* Make the Pay button appear before the Back button on mobile */
  }
`;

// Phương thức thanh toán
const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: <FaCreditCard />
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Pay via bank transfer',
    icon: <FaUniversity />
  },
  {
    id: 'momo',
    name: 'MoMo',
    description: 'Pay with MoMo e-wallet',
    icon: <FaQrcode />
  }
];

const PaymentPage = () => {
  const { bookingState, selectPaymentMethod, confirmBooking } = useBooking();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState('');
  
  // Redirect if previous steps are not completed
  useEffect(() => {
    if (!bookingState.serviceType || !bookingState.packageDuration || !bookingState.date || !bookingState.selectedSeat) {
      navigate('/booking/service');
    }
  }, [bookingState, navigate]);
  
  const handlePaymentMethodSelect = (methodId) => {
    selectPaymentMethod(methodId);
    setValidationError('');
  };
  
  const handlePayment = () => {
    if (!bookingState.paymentMethod) {
      setValidationError('Please select a payment method to continue.');
      return;
    }
    
    // Xử lý thanh toán
    confirmBooking();
    
    // Thông báo thành công và chuyển đến trang xác nhận
    setTimeout(() => {
      alert('Payment successful! Your workspace has been reserved.');
      navigate('/booking/confirmation');
    }, 1000);
  };
  
  const handleBackStep = () => {
    navigate('/booking/seat');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
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
      title="Payment"
      subtitle="Complete your booking by selecting a payment method"
    >
      <PaymentContainer>
        <BookingSummary>
          <SummaryTitle>Booking Details</SummaryTitle>
          
          <SummaryRow>
            <SummaryLabel>Customer:</SummaryLabel>
            <SummaryValue>{currentUser?.fullName || 'Not Available'}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Service:</SummaryLabel>
            <SummaryValue>
              {bookingState.serviceType === 'hot-desk' ? 'Hot Desk' : 'Fixed Desk'}
            </SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Duration:</SummaryLabel>
            <SummaryValue>
              {bookingState.packageDuration === 'daily' && 'Daily'}
              {bookingState.packageDuration === 'weekly' && 'Weekly'}
              {bookingState.packageDuration === 'monthly' && 'Monthly'}
              {bookingState.packageDuration === 'yearly' && 'Yearly'}
            </SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Date & Time:</SummaryLabel>
            <SummaryValue>{formatDate(bookingState.date)}</SummaryValue>
          </SummaryRow>
          
          <SummaryRow>
            <SummaryLabel>Seat:</SummaryLabel>
            <SummaryValue>{bookingState.selectedSeat?.name || 'Not selected'}</SummaryValue>
          </SummaryRow>
          
          <PriceSummary>
            <PriceRow>
              <div>Base Price:</div>
              <div>{formatCurrency(bookingState.paymentDetails.totalAmount)}</div>
            </PriceRow>
            
            {bookingState.paymentDetails.discount > 0 && (
              <PriceRow>
                <div>Discount:</div>
                <div>- {formatCurrency(bookingState.paymentDetails.discount)}</div>
              </PriceRow>
            )}
            
            <TotalRow>
              <div>Total Amount:</div>
              <div>{formatCurrency(bookingState.paymentDetails.finalAmount)}</div>
            </TotalRow>
          </PriceSummary>
        </BookingSummary>
        
        <PaymentMethodTitle>Select Payment Method</PaymentMethodTitle>
        <PaymentMethodsContainer>
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              selected={bookingState.paymentMethod === method.id}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <PaymentMethodIcon>{method.icon}</PaymentMethodIcon>
              <PaymentMethodInfo>
                <PaymentMethodName>{method.name}</PaymentMethodName>
                <PaymentMethodDescription>{method.description}</PaymentMethodDescription>
              </PaymentMethodInfo>
            </PaymentMethodCard>
          ))}
        </PaymentMethodsContainer>
        
        {validationError && (
          <div style={{ color: '#e74c3c', textAlign: 'center', margin: '1rem 0' }}>
            {validationError}
          </div>
        )}
        
        <ActionContainer>
          <BackButton onClick={handleBackStep}>
            Back
          </BackButton>
          <PayButton onClick={handlePayment}>
            Complete Payment
          </PayButton>
        </ActionContainer>
      </PaymentContainer>
    </BookingLayout>
  );
};

export default PaymentPage;