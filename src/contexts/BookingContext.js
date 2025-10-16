import React, { createContext, useState, useContext } from 'react';

// Tạo context
export const BookingContext = createContext();

// Data mẫu cho seat map
const sampleSeats = {
  "hot-desk": [
    { id: "A1", name: "A1", available: true, type: "hot-desk" },
    { id: "A2", name: "A2", available: false, type: "hot-desk" },
    { id: "A3", name: "A3", available: true, type: "hot-desk" },
    { id: "A4", name: "A4", available: true, type: "hot-desk" },
    { id: "A5", name: "A5", available: true, type: "hot-desk" },
    { id: "A6", name: "A6", available: false, type: "hot-desk" },
    { id: "A7", name: "A7", available: true, type: "hot-desk" },
    { id: "A8", name: "A8", available: true, type: "hot-desk" },
    { id: "B1", name: "B1", available: false, type: "hot-desk" },
    { id: "B2", name: "B2", available: true, type: "hot-desk" },
    { id: "B3", name: "B3", available: false, type: "hot-desk" },
    { id: "B4", name: "B4", available: true, type: "hot-desk" },
    { id: "B5", name: "B5", available: true, type: "hot-desk" },
    { id: "B6", name: "B6", available: false, type: "hot-desk" },
    { id: "B7", name: "B7", available: true, type: "hot-desk" },
    { id: "B8", name: "B8", available: false, type: "hot-desk" },
    { id: "C1", name: "C1", available: true, type: "hot-desk" },
    { id: "C2", name: "C2", available: true, type: "hot-desk" },
    { id: "C3", name: "C3", available: false, type: "hot-desk" },
    { id: "C4", name: "C4", available: true, type: "hot-desk" },
    { id: "C5", name: "C5", available: false, type: "hot-desk" },
    { id: "C6", name: "C6", available: true, type: "hot-desk" },
    { id: "C7", name: "C7", available: true, type: "hot-desk" },
    { id: "C8", name: "C8", available: false, type: "hot-desk" },
    { id: "D1", name: "D1", available: true, type: "hot-desk" },
    { id: "D2", name: "D2", available: false, type: "hot-desk" },
    { id: "D3", name: "D3", available: true, type: "hot-desk" },
    { id: "D4", name: "D4", available: false, type: "hot-desk" },
    { id: "D5", name: "D5", available: true, type: "hot-desk" },
    { id: "D6", name: "D6", available: true, type: "hot-desk" },
    { id: "D7", name: "D7", available: false, type: "hot-desk" },
    { id: "D8", name: "D8", available: true, type: "hot-desk" }
  ],
  "fixed-desk": [
    { id: "A1-F", name: "A1", available: false, type: "fixed-desk" },
    { id: "A2-F", name: "A2", available: true, type: "fixed-desk" },
    { id: "A3-F", name: "A3", available: true, type: "fixed-desk" },
    { id: "A4-F", name: "A4", available: false, type: "fixed-desk" },
    { id: "A5-F", name: "A5", available: true, type: "fixed-desk" },
    { id: "A6-F", name: "A6", available: true, type: "fixed-desk" },
    { id: "A7-F", name: "A7", available: false, type: "fixed-desk" },
    { id: "A8-F", name: "A8", available: true, type: "fixed-desk" },
    { id: "B1-F", name: "B1", available: true, type: "fixed-desk" },
    { id: "B2-F", name: "B2", available: true, type: "fixed-desk" },
    { id: "B3-F", name: "B3", available: false, type: "fixed-desk" },
    { id: "B4-F", name: "B4", available: true, type: "fixed-desk" },
    { id: "B5-F", name: "B5", available: false, type: "fixed-desk" },
    { id: "B6-F", name: "B6", available: true, type: "fixed-desk" },
    { id: "B7-F", name: "B7", available: true, type: "fixed-desk" },
    { id: "B8-F", name: "B8", available: false, type: "fixed-desk" },
    { id: "C1-F", name: "C1", available: true, type: "fixed-desk" },
    { id: "C2-F", name: "C2", available: false, type: "fixed-desk" },
    { id: "C3-F", name: "C3", available: true, type: "fixed-desk" },
    { id: "C4-F", name: "C4", available: true, type: "fixed-desk" },
    { id: "C5-F", name: "C5", available: false, type: "fixed-desk" },
    { id: "C6-F", name: "C6", available: true, type: "fixed-desk" },
    { id: "C7-F", name: "C7", available: false, type: "fixed-desk" },
    { id: "C8-F", name: "C8", available: true, type: "fixed-desk" },
    { id: "D1-F", name: "D1", available: false, type: "fixed-desk" },
    { id: "D2-F", name: "D2", available: true, type: "fixed-desk" },
    { id: "D3-F", name: "D3", available: true, type: "fixed-desk" },
    { id: "D4-F", name: "D4", available: false, type: "fixed-desk" },
    { id: "D5-F", name: "D5", available: true, type: "fixed-desk" },
    { id: "D6-F", name: "D6", available: false, type: "fixed-desk" },
    { id: "D7-F", name: "D7", available: true, type: "fixed-desk" },
    { id: "D8-F", name: "D8", available: true, type: "fixed-desk" }
  ]
};

export const BookingProvider = ({ children }) => {
  // State quản lý các bước booking
  const [bookingState, setBookingState] = useState({
    // Bước 1: Chọn loại dịch vụ
    serviceType: null, // 'hot-desk' hoặc 'fixed-desk'
    
    // Bước 2: Chọn gói thời gian
    packageDuration: null, // 'daily', 'weekly', 'monthly', 'yearly'
    
    // Bước 3: Chọn ngày và giờ
    date: null,
    endDate: null, // Thêm ngày kết thúc dựa vào package duration
    time: null, // Thêm giờ bắt đầu riêng
    endTime: null, // Thêm giờ kết thúc riêng
    
    // Bước 4: Chọn vị trí chỗ ngồi
    selectedSeat: null,
    
    // Bước 5: Thanh toán
    paymentMethod: null, // 'credit-card', 'bank-transfer', 'momo', etc.
    bookingComplete: false,
    
    // Lưu trữ dữ liệu chỗ ngồi
    seats: sampleSeats,
    
    // Thông tin thanh toán
    paymentDetails: {
      totalAmount: 0,
      discount: 0,
      finalAmount: 0
    }
  });

  // Lưu trữ bước hiện tại
  const [currentStep, setCurrentStep] = useState(1);

  // Phương thức cập nhật service type (Bước 1)
  const selectServiceType = (type) => {
    // Tính giá tiền dựa trên loại dịch vụ
    const basePrice = type === 'hot-desk' ? 2350000 : 2950000;
    
    setBookingState({
      ...bookingState,
      serviceType: type,
      // Reset các bước tiếp theo nếu thay đổi loại dịch vụ
      packageDuration: null,
      date: null,
      selectedSeat: null,
      paymentMethod: null,
      bookingComplete: false,
      paymentDetails: {
        ...bookingState.paymentDetails,
        totalAmount: basePrice,
        finalAmount: basePrice
      }
    });
    setCurrentStep(2); // Chuyển sang bước 2
  };

  // Phương thức cập nhật package duration (Bước 2)
  const selectPackageDuration = (duration) => {
    // Tính giá tiền dựa trên gói thời gian
    let basePrice = bookingState.paymentDetails.totalAmount;
    let discount = 0;
    let finalAmount = basePrice;
    
    // Áp dụng chiết khấu theo thời gian thuê
    if (duration === 'weekly') {
      discount = basePrice * 0.05; // Giảm 5% cho thuê theo tuần
    } else if (duration === 'monthly') {
      discount = basePrice * 0.1; // Giảm 10% cho thuê theo tháng
    } else if (duration === 'yearly') {
      discount = basePrice * 0.15; // Giảm 15% cho thuê theo năm
    }
    
    finalAmount = basePrice - discount;
    
    setBookingState({
      ...bookingState,
      packageDuration: duration,
      // Reset các bước tiếp theo nếu thay đổi gói thời gian
      date: null,
      selectedSeat: null,
      paymentMethod: null,
      bookingComplete: false,
      paymentDetails: {
        totalAmount: basePrice,
        discount: discount,
        finalAmount: finalAmount
      }
    });
    setCurrentStep(3); // Chuyển sang bước 3
  };

  // Phương thức cập nhật ngày (Bước 3)
  const selectDate = (date, endDate, time, endTime) => {
    setBookingState({
      ...bookingState,
      date,
      endDate,
      time,
      endTime,
      // Reset các bước tiếp theo nếu thay đổi ngày
      selectedSeat: null,
      paymentMethod: null,
      bookingComplete: false
    });
    setCurrentStep(4); // Chuyển sang bước 4
  };

  // Phương thức cập nhật chỗ ngồi (Bước 4)
  const selectSeat = (seat) => {
    setBookingState({
      ...bookingState,
      selectedSeat: seat,
      paymentMethod: null,
      bookingComplete: false
    });
    setCurrentStep(5); // Chuyển sang bước 5 - Thanh toán
  };

  // Phương thức chọn phương thức thanh toán (Bước 5)
  const selectPaymentMethod = (method) => {
    setBookingState({
      ...bookingState,
      paymentMethod: method
    });
  };

  // Phương thức xác nhận thanh toán và hoàn tất đặt chỗ (Bước 5)
  const confirmBooking = () => {
    setBookingState({
      ...bookingState,
      bookingComplete: true
    });
    // Ở đây có thể thêm logic gửi dữ liệu đặt chỗ và thanh toán đến server
  };

  // Phương thức reset lại quá trình booking
  const resetBooking = () => {
    setBookingState({
      serviceType: null,
      packageDuration: null,
      date: null,
      selectedSeat: null,
      paymentMethod: null,
      bookingComplete: false,
      seats: sampleSeats,
      paymentDetails: {
        totalAmount: 0,
        discount: 0,
        finalAmount: 0
      }
    });
    setCurrentStep(1);
  };

  // Kiểm tra xem có thể tiếp tục bước tiếp theo không
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!bookingState.serviceType;
      case 2:
        return !!bookingState.packageDuration;
      case 3:
        return !!bookingState.date;
      case 4:
        return !!bookingState.selectedSeat;
      case 5:
        return !!bookingState.paymentMethod; // Cần chọn phương thức thanh toán để xác nhận
      default:
        return false;
    }
  };

  // Giá trị cung cấp cho context
  const value = {
    bookingState,
    currentStep,
    setCurrentStep,
    selectServiceType,
    selectPackageDuration,
    selectDate,
    selectSeat,
    selectPaymentMethod,
    confirmBooking,
    resetBooking,
    canProceed
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng BookingContext
export const useBooking = () => {
  return useContext(BookingContext);
};
