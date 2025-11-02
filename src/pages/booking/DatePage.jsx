import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BookingLayout from './BookingLayout';
import { useBooking } from '../../contexts/BookingContext';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

const DateSelectionContainer = styled.div`
  background-color: #fff;
  margin: 2rem auto;
  max-width: 800px;
  
  @media (max-width: 768px) {
    margin: 1.5rem auto;
  }
  
  @media (max-width: 480px) {
    margin: 1rem auto;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const DateCard = styled.div`
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  background-color: ${props => props.disabled ? '#f9f9f9' : '#fff'};
  
  h4 {
    margin-top: 0;
    color: #333;
    margin-bottom: 1rem;
  }
`;

const HighlightedInfo = styled.div`
  background-color: #f0f8f0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0;
    color: #45bf55;
    font-weight: 500;
  }
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const CustomDatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #45bf55;
      box-shadow: 0 0 0 2px rgba(69, 191, 85, 0.2);
    }
  }
  
  .react-datepicker {
    border-color: #ddd;
    font-family: inherit;
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
  
  .react-datepicker__day--selected {
    background-color: #45bf55;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: rgba(69, 191, 85, 0.5);
  }
  
  .react-datepicker__day:hover {
    background-color: rgba(69, 191, 85, 0.2);
  }
  
  @media (max-width: 480px) {
    .react-datepicker {
      margin: 0 auto;
    }
    
    .react-datepicker__month-container {
      width: 100%;
    }
  }
`;

const TimeOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
`;

const TimeOption = styled.div`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  ${props => props.selected && `
    background-color: #45bf55;
    color: white;
    border-color: #45bf55;
  `}
  
  &:hover {
    border-color: #45bf55;
    background-color: ${props => props.selected ? '#45bf55' : 'rgba(69, 191, 85, 0.1)'};
  }
  
  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
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

const DatePage = () => {
  const { bookingState, selectDate } = useBooking();
  const navigate = useNavigate();
  
  // Redirect if service type or package duration is not selected
  useEffect(() => {
    if (!bookingState.serviceType || !bookingState.packageDuration) {
      navigate('/booking/service');
    }
  }, [bookingState.serviceType, bookingState.packageDuration, navigate]);
  
  // State để lưu trữ ngày và giờ đã chọn
  const [selectedDate, setSelectedDate] = useState(
    bookingState.date ? new Date(bookingState.date) : null
  );
  const [selectedTime, setSelectedTime] = useState(
    bookingState.date ? new Date(bookingState.date).getHours() + ':00' : null
  );
  
  // Tính toán ngày kết thúc dựa trên package duration
  const calculateEndDate = (startDate) => {
    if (!startDate) return null;
    
    const date = new Date(startDate);
    
    switch(bookingState.packageDuration) {
      case 'daily':
        return addDays(date, 1);
      case 'weekly':
        return addDays(date, 7);
      case 'monthly':
        return addMonths(date, 1);
      case 'yearly':
        return addYears(date, 1);
      default:
        return date;
    }
  };
  
  // Hiển thị thông tin về thời gian của gói
  const getDurationLabel = () => {
    switch(bookingState.packageDuration) {
      case 'daily':
        return 'Thời hạn sử dụng: 1 ngày';
      case 'weekly':
        return 'Thời hạn sử dụng: 7 ngày';
      case 'monthly':
        return 'Thời hạn sử dụng: 30 ngày';
      case 'yearly':
        return 'Thời hạn sử dụng: 365 ngày';
      default:
        return '';
    }
  };
  
  // Tính ngày kết thúc dựa trên ngày bắt đầu đã chọn
  const endDate = selectedDate ? calculateEndDate(selectedDate) : null;
  
  // Danh sách các khung giờ có sẵn
  const timeSlots = ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  // Xử lý khi chọn ngày
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes
  };
  
  // Xử lý khi chọn giờ
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  // Format date to string
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    return `${formatDate(date)} lúc ${time}`;
  };
  
  // Xử lý khi nhấn Next
  const handleNextStep = () => {
    if (selectedDate && selectedTime) {
      // Tạo date object với ngày và giờ đã chọn
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);
      
      // Tạo end date với cùng giờ
      const endDateTime = calculateEndDate(dateTime);
      
      // Lưu thông tin ngày giờ bắt đầu và kết thúc
      selectDate(
        dateTime.toISOString(), 
        endDateTime.toISOString(),
        selectedTime,
        selectedTime // Giờ kết thúc giống giờ bắt đầu
      );
      navigate('/booking/seat');
    }
  };
  
  // Xử lý khi nhấn Back
  const handleBackStep = () => {
    navigate('/booking/package-duration');
  };

  // Giới hạn ngày cho date picker (chỉ cho phép chọn ngày từ ngày hiện tại trở đi)
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Cho phép đặt chỗ tối đa 2 tháng trước

  return (
    <BookingLayout
      title="Select Date & Time"
      subtitle="Choose when you'd like to reserve your workspace"
    >
      <DateSelectionContainer>
        <HighlightedInfo>
          <p>{getDurationLabel()} ({bookingState.packageDuration.charAt(0).toUpperCase() + bookingState.packageDuration.slice(1)} Package)</p>
        </HighlightedInfo>
        
        <DateRangeContainer>
          <DateCard>
            <h4>Start Date</h4>
            <FormGroup>
              <Label>Select Starting Date</Label>
              <CustomDatePickerWrapper>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  minDate={minDate}
                  maxDate={maxDate}
                  placeholderText="Select a date"
                  required
                  inline
                />
              </CustomDatePickerWrapper>
            </FormGroup>
          </DateCard>
          
          <DateCard disabled={true}>
            <h4>End Date</h4>
            <FormGroup>
              <Label>End Date & Time (Calculated automatically)</Label>
              <div style={{ padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
                {endDate && selectedTime ? (
                  <div style={{ fontWeight: "500", color: "#45bf55" }}>
                    {formatDate(endDate)} lúc {selectedTime}
                  </div>
                ) : (
                  <div style={{ color: "#999" }}>Please select a start date and time first</div>
                )}
              </div>
            </FormGroup>
          </DateCard>
        </DateRangeContainer>
        
        {selectedDate && (
          <FormGroup>
            <Label>Select Time</Label>
            <TimeOptionsContainer>
              {timeSlots.map((time) => (
                <TimeOption 
                  key={time} 
                  selected={selectedTime === time}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </TimeOption>
              ))}
            </TimeOptionsContainer>
          </FormGroup>
        )}
        
        <ActionContainer>
          <BackButton onClick={handleBackStep}>
            Back
          </BackButton>
          <NextButton 
            disabled={!selectedDate || !selectedTime}
            onClick={handleNextStep}
          >
            Next Step
          </NextButton>
        </ActionContainer>
      </DateSelectionContainer>
    </BookingLayout>
  );
};

export default DatePage;
