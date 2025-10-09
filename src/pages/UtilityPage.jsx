import React from 'react';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Space for fixed header */
`;

const SectionContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const FeaturesLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

// Working 24/7 Section
const WorkingSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WorkingImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const WorkingContent = styled.div`
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    color: #555;
    line-height: 1.6;
  }
`;

// Location Section
const LocationSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    flex-direction: column-reverse;
  }
`;

const LocationImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const LocationContent = styled.div`
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    color: #555;
    line-height: 1.6;
  }
`;

// Internet and Flexible Section
const DoubleFeatureSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    color: #555;
    line-height: 1.6;
  }
`;

// All-Inclusive Service Section
const ServiceSection = styled.div`
  h3 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    color: #555;
    line-height: 1.5;
    font-size: 0.95rem;
  }
`;

// Professional Space Section
const ProfessionalSpaceSection = styled.div`
  h3 {
    font-size: 1.8rem;
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
  }
`;

const SpacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DiscussionArea = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  
  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  h4 {
    font-size: 1.3rem;
    color: #333;
  }
`;

const SpaceCard = styled.div`
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h4 {
    font-size: 1.3rem;
    color: #333;
    text-align: center;
  }
`;

const UtilityPage = () => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <SectionContainer>
          <SectionTitle>Customer utilities</SectionTitle>
          <FeaturesLayout>
            {/* Working 24/7 Section */}
            <WorkingSection>
              <WorkingImage 
                src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941785/working-247_hcbrr5.jpg" 
                alt="Working 24/7 at SWSpace" 
              />
              <WorkingContent>
                <h3>Working 24/7</h3>
                <p>
                  The space is always ready, with flexible access using a personal key card and 24/7 security. Perfect for late-night inspiration or early morning projects, working beyond regular office hours.
                </p>
              </WorkingContent>
            </WorkingSection>

            {/* Location Section */}
            <LocationSection>
              <LocationContent>
                <h3>Prime location – Convenient transportation</h3>
                <p>
                  Located in the center of Hai Chau District, right on Quang Trung Street, Da Nang City, SWSpace has a prime location, easily connected to government offices and the city's core areas.
                </p>
              </LocationContent>
              <LocationImage 
                src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941785/prime-location_yssv0v.jpg" 
                alt="Prime location of SWSpace" 
              />
            </LocationSection>

            {/* High-speed Internet and Flexible & cost-effective */}
            <DoubleFeatureSection>
              <FeatureCard>
                <img 
                  src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941784/high-speed-internet_nlcmlq.jpg" 
                  alt="High-speed Internet" 
                />
                <h3>High-speed Internet</h3>
                <p>
                  Equipped with dedicated high-speed fiber optic connections and an automatic switch-over backup system. No more worries about network lag during online meetings, team work, or calls with global partners.
                </p>
              </FeatureCard>
              <FeatureCard>
                <img 
                  src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941783/flexible-cost-effective_hfhets.jpg" 
                  alt="Flexible & cost-effective space" 
                />
                <h3>Flexible & cost-effective</h3>
                <p>
                  Flexible contracts according to needs (monthly, yearly). No need for initial investment in furniture and office equipment.
                </p>
              </FeatureCard>
            </DoubleFeatureSection>

            {/* All-inclusive service */}
            <ServiceSection>
              <h3>All-inclusive service</h3>
              <ServicesGrid>
                <ServiceCard>
                  <img 
                    src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941783/free-drinks_csjy3j.jpg" 
                    alt="Free drinks at SWSpace" 
                  />
                  <h4>Free drinks</h4>
                  <p>Coffee, tea, soft drinks...</p>
                </ServiceCard>
                <ServiceCard>
                  <img 
                    src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941784/printing-copying_wnbyog.jpg" 
                    alt="Printing and copying services" 
                  />
                  <h4>Printing and convenient copying</h4>
                  <p>You just need to place the order on the computer, and all the documents will be ready in a few minutes.</p>
                </ServiceCard>
                <ServiceCard>
                  <img 
                    src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941784/receptionist_e6kjzw.jpg" 
                    alt="Professional receptionist" 
                  />
                  <h4>Professional receptionist</h4>
                  <p>Receiving guests, handling correspondence, scheduling meetings.</p>
                </ServiceCard>
              </ServicesGrid>
            </ServiceSection>

            {/* Professional space at SWSpace */}
            <ProfessionalSpaceSection>
              <h3>Professional space at SWSpace</h3>
              <SpacesGrid>
                <SpaceCard>
                  <img 
                    src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941784/pantry-area_wpyhlz.jpg" 
                    alt="Pantry Area at SWSpace" 
                  />
                  <h4>Pantry Area</h4>
                </SpaceCard>
                <SpaceCard>
                  <img 
                    src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941784/meeting-room_kegdci.jpg" 
                    alt="Meeting room at SWSpace" 
                  />
                  <h4>Meeting room</h4>
                </SpaceCard>
              </SpacesGrid>
              <DiscussionArea>
                <img 
                  src="https://res.cloudinary.com/dvwp5td6y/image/upload/v1759941783/discussion-area_v1kzw0.jpg" 
                  alt="General discussion area" 
                />
                <h4>General discussion area</h4>
              </DiscussionArea>
            </ProfessionalSpaceSection>
          </FeaturesLayout>
        </SectionContainer>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default UtilityPage;