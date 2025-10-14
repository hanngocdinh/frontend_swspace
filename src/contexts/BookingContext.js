import React, { createContext, useState, useContext } from 'react';

// Tạo context
export const BookingContext = createContext();

// Data mẫu cho seat map
const sampleSeats = {
  "hot-desk": [
    { id: "A1", name: "A1", available: true, type: "hot-desk" },
    { id: "A2", name: "A2", available: true, type: "hot-desk" },
    { id: "A3", name: "A3", available: false, type: "hot-desk" },
    { id: "A4", name: "A4", available: true, type: "hot-desk" },
    { id: "B1", name: "B1", available: true, type: "hot-desk" },
    { id: "B2", name: "B2", available: false, type: "hot-desk" },
    { id: "B3", name: "B3", available: true, type: "hot-desk" },
    { id: "B4", name: "B4", available: true, type: "hot-desk" },
    { id: "C1", name: "C1", available: true, type: "hot-desk" },
    { id: "C2", name: "C2", available: true, type: "hot-desk" },
    { id: "C3", name: "C3", available: true, type: "hot-desk" },
    { id: "C4", name: "C4", available: false, type: "hot-desk" }
  ],
  "fixed-desk": [
    { id: "D1", name: "D1", available: true, type: "fixed-desk" },
    { id: "D2", name: "D2", available: true, type: "fixed-desk" },
    { id: "D3", name: "D3", available: false, type: "fixed-desk" },
    { id: "D4", name: "D4", available: true, type: "fixed-desk" },
    { id: "E1", name: "E1", available: true, type: "fixed-desk" },
    { id: "E2", name: "E2", available: false, type: "fixed-desk" },
    { id: "E3", name: "E3", available: true, type: "fixed-desk" },
    { id: "E4", name: "E4", available: true, type: "fixed-desk" }
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
  const selectDate = (date) => {
    setBookingState({
      ...bookingState,
      date,
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
