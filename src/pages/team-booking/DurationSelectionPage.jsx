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

const ServiceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ServiceImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
`;

const ServiceName = styled.h2`
  color: #45bf55;
  font-size: 1.5rem;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const PackagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PackageCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid transparent;
  position: relative;
  
  ${props => props.recommended && `
    border-color: #45bf55;
    transform: scale(1.05);
    
    &::before {
      content: 'RECOMMENDED';
      position: absolute;
      top: -10px;
      right: 20px;
      background: #45bf55;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }
  `}
  
  &:hover {
    transform: translateY(-5px) ${props => props.recommended ? 'scale(1.05)' : ''};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const PackageName = styled.h3`
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Duration = styled.div`
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #45bf55;
  margin-bottom: 1rem;
  
  span {
    font-size: 0.8rem;
    color: #7f8c8d;
    font-weight: normal;
  }
`;

const DiscountBadge = styled.div`
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  display: inline-block;
`;

const DiscountDescription = styled.p`
  color: #27ae60;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const CustomHoursSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const CustomHoursLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const CustomHoursInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #45bf55;
  }
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #45bf55 0%, #38a046 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
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

const DurationSelectionPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customHours, setCustomHours] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedService = location.state?.selectedService;

  useEffect(() => {
    if (!selectedService) {
      navigate('/team-booking');
      return;
    }
    fetchPackages();
  }, [selectedService, navigate]);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`/api/team/services/${encodeURIComponent(selectedService.name)}/packages`);
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.data);
      } else {
        setError('Failed to load packages');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages');
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

  const getRecommendedPackageIndex = () => {
    if (selectedService.name === 'Private Office') return 1; // 6 months
    if (selectedService.name === 'Meeting Room') return 1; // 5 hours
    if (selectedService.name === 'Networking Space') return 1; // Full day
    return 0;
  };

  const handlePackageSelect = (pkg) => {
    const hours = pkg.isCustom ? customHours[pkg._id] : null;
    
    if (pkg.isCustom && (!hours || hours < 1)) {
      alert('Please enter valid number of hours');
      return;
    }

    navigate('/team-booking/date', {
      state: {
        selectedService,
        selectedPackage: pkg,
        customHours: hours
      }
    });
  };

  const handleCustomHoursChange = (packageId, value) => {
    setCustomHours(prev => ({
      ...prev,
      [packageId]: parseInt(value) || 0
    }));
  };

  const calculateCustomPrice = (pkg, hours) => {
    return pkg.pricePerUnit * (hours || 0);
  };

  if (!selectedService) {
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
        <BackButton onClick={() => navigate('/team-booking')}>
          ← Back to Services
        </BackButton>
        
        <HeaderSection>
          <ServiceInfo>
            <ServiceImage src={selectedService.image} alt={selectedService.name} />
            <ServiceName>{selectedService.name}</ServiceName>
          </ServiceInfo>
          
          <Title>Choose Your <span>Duration</span> Package</Title>
          <Subtitle>
            Select the perfect duration package for your {selectedService.name} booking.
            {selectedService.name === 'Meeting Room' && ' Custom hours available for flexible scheduling.'}
          </Subtitle>
        </HeaderSection>

        <PackagesGrid>
        {packages.map((pkg, index) => (
          <PackageCard 
            key={pkg._id} 
            recommended={index === getRecommendedPackageIndex()}
            onClick={() => handlePackageSelect(pkg)}
          >
            <PackageName>{pkg.name}</PackageName>
            <Duration>{getDurationText(pkg.duration)}</Duration>
            
            {pkg.discount.percentage > 0 && (
              <>
                <DiscountBadge>SAVE {pkg.discount.percentage}%</DiscountBadge>
                <DiscountDescription>{pkg.discount.description}</DiscountDescription>
              </>
            )}
            
            <Price>
              {pkg.isCustom ? (
                <>
                  {formatPrice(calculateCustomPrice(pkg, customHours[pkg._id]))}
                  <span> / {customHours[pkg._id] || 0} giờ</span>
                </>
              ) : (
                <>
                  {formatPrice(pkg.price)}
                  <span> / {getDurationText(pkg.duration)}</span>
                </>
              )}
            </Price>

            {pkg.isCustom && (
              <CustomHoursSection onClick={(e) => e.stopPropagation()}>
                <CustomHoursLabel>Number of Hours:</CustomHoursLabel>
                <CustomHoursInput
                  type="number"
                  min="1"
                  max="24"
                  value={customHours[pkg._id] || ''}
                  onChange={(e) => handleCustomHoursChange(pkg._id, e.target.value)}
                  placeholder="Enter hours (1-24)"
                />
              </CustomHoursSection>
            )}
            
            <SelectButton
              onClick={(e) => {
                e.stopPropagation();
                handlePackageSelect(pkg);
              }}
              disabled={pkg.isCustom && (!customHours[pkg._id] || customHours[pkg._id] < 1)}
            >
              Select This Package
            </SelectButton>
          </PackageCard>
        ))}
      </PackagesGrid>
    </Container>
    <Footer />
    </>
  );
};

export default DurationSelectionPage;