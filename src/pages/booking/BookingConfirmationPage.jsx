import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import BookingLayout from './BookingLayout';
import { useBooking } from '../../contexts/BookingContext';
import { useAuth } from '../../contexts/AuthContext';

const ConfirmationContainer = styled.div`
  background-color: #fff;
  margin: 1rem 0;
`;

const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
  }
`;

const CheckIcon = styled(FaCheckCircle)`
  color: #45bf55;
  font-size: 4rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 0.75rem;
  }
`;

const SuccessTitle = styled.h3`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const SuccessText = styled.p`
  font-size: 1.1rem;
  color: #555;
  text-align: center;
  max-width: 500px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
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

const ImportantNote = styled.div`
  background-color: #f8f9fa;
  border-left: 4px solid #45bf55;
  padding: 1rem;
  margin: 1.5rem 0;
  font-size: 0.9rem;
  color: #333;
  
  @media (max-width: 768px) {
    padding: 0.9rem;
    margin: 1.25rem 0;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    margin: 1rem 0;
    font-size: 0.85rem;
  }
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

const ConfirmButton = styled.button`
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
  
  @media (max-width: 768px) {
    padding: 0.7rem 1.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
    width: 100%;
    max-width: 200px;
    order: -1; /* Make the Confirm button appear before the Back button on mobile */
  }
`;

const BookingConfirmationPage = () => {
  const { bookingState, resetBooking } = useBooking(); // Removed confirmBooking since it was already done in PaymentPage
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if previous steps are not completed
  React.useEffect(() => {
    if (!bookingState.serviceType || !bookingState.packageDuration || !bookingState.date || !bookingState.selectedSeat || !bookingState.paymentMethod) {
      navigate('/booking/service');
    }
  }, [bookingState, navigate]);
  
  const handleDone = () => {
    resetBooking();
    navigate('/');
  };
  
  const handleBackStep = () => {
    navigate('/booking/payment');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <BookingLayout
      title="Booking Confirmation"
      subtitle="Review and confirm your workspace reservation"
    >
      <ConfirmationContainer>
        {!bookingState.bookingComplete ? (
          <>
            <BookingSummary>
              <SummaryTitle>Booking Details</SummaryTitle>
              
              <SummaryRow>
                <SummaryLabel>Customer:</SummaryLabel>
                <SummaryValue>{currentUser?.fullName || 'Not Available'}</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Service:</SummaryLabel>
                <SummaryValue>{bookingState.serviceType === 'hot-desk' ? 'Hot Desk' : 'Fixed Desk'}</SummaryValue>
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
                <SummaryLabel>Price:</SummaryLabel>
                <SummaryValue>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0
                  }).format(bookingState.paymentDetails.finalAmount)}
                </SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Payment Method:</SummaryLabel>
                <SummaryValue>
                  {bookingState.paymentMethod === 'credit-card' && 'Credit/Debit Card'}
                  {bookingState.paymentMethod === 'bank-transfer' && 'Bank Transfer'}
                  {bookingState.paymentMethod === 'momo' && 'MoMo'}
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
            </BookingSummary>
            
            <ImportantNote>
              <strong>Important:</strong> By confirming this booking, you agree to our terms and conditions.
              You will receive an email confirmation with your booking details shortly after completion.
            </ImportantNote>
            
            <ActionContainer>
              <BackButton onClick={handleBackStep}>
                Back to Payment
              </BackButton>
              <ConfirmButton onClick={handleDone}>
                Done
              </ConfirmButton>
            </ActionContainer>
          </>
        ) : (
          <SuccessMessage>
            <CheckIcon />
            <SuccessTitle>Booking Successful!</SuccessTitle>
            <SuccessText>
              Your workspace has been successfully reserved. A confirmation email has been sent to your registered email address.
            </SuccessText>
          </SuccessMessage>
        )}
      </ConfirmationContainer>
    </BookingLayout>
  );
};

export default BookingConfirmationPage;