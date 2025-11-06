import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  
  span {
    color: #45bf55;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ServiceImage = styled.div`
  height: 250px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7));
  }
`;

const ServiceContent = styled.div`
  padding: 1.5rem;
`;

const ServiceName = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ServiceDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const FeatureItem = styled.li`
  color: #45bf55;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &::before {
    content: '✓';
    margin-right: 0.5rem;
    font-weight: bold;
  }
`;

const ServiceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-top: 1px solid #ecf0f1;
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #95a5a6;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(69, 191, 85, 0.3);
  }
  
  &:active {
    transform: translateY(0);
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

const TeamServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/team/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        setError('Failed to load services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    // Navigate to duration selection page with service data
    navigate(`/team-booking/duration`, {
      state: { selectedService: service }
    });
  };

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
        <HeaderSection>
          <Title>Choose Your <span>Team</span> Service</Title>
          <Subtitle>
            Select from our premium spaces designed for teams and collaboration. 
            Each service offers unique features to meet your specific needs.
          </Subtitle>
        </HeaderSection>

      <ServicesGrid>
        {services.map((service) => (
          <ServiceCard key={service._id} onClick={() => handleServiceSelect(service)}>
            <ServiceImage image={service.image} />
            <ServiceContent>
              <ServiceName>{service.name}</ServiceName>
              <ServiceDescription>{service.description}</ServiceDescription>
              
              <FeaturesList>
                {service.features.slice(0, 4).map((feature, index) => (
                  <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
              </FeaturesList>
              
              <ServiceInfo>
                <InfoItem>
                  <InfoLabel>Capacity</InfoLabel>
                  <InfoValue>{service.capacity.min}-{service.capacity.max} people</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Advance Booking</InfoLabel>
                  <InfoValue>{service.minimumBookingAdvance}</InfoValue>
                </InfoItem>
              </ServiceInfo>
              
              <SelectButton>
                Select {service.name}
              </SelectButton>
            </ServiceContent>
          </ServiceCard>
        ))}
      </ServicesGrid>
    </Container>
    <Footer />
    </>
  );
};

export default TeamServicesPage;