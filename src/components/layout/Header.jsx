import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';
import { FaBars } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  span.sw {
    color: #45bf55;
  }

  span.space {
    color: #333;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: white;
    padding: 1rem 0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavItem = styled.div`
  margin: 0 1rem;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #45bf55;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const BookButton = styled.a`
  background-color: #45bf55;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  margin-left: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #38a046;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    margin: 1rem 0 0;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer style={{ backgroundColor: scrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.95)' }}>
      <NavContainer>
        <Logo>
          <a href="/">
            <span className="sw">SW</span>
            <span className="space">Space</span>
          </a>
        </Logo>

        <MobileMenuIcon onClick={toggleMenu}>
          <FaBars />
        </MobileMenuIcon>

        <NavLinks isOpen={isOpen}>
          <NavItem>
            <Link to="home" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
              Our Space
            </Link>
          </NavItem>
          <NavItem>
            <Link to="about" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
              About
            </Link>
          </NavItem>
          <NavItem>
            <Link to="community" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
              Community
            </Link>
          </NavItem>
          <NavItem>
            <Link to="utility" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
              Utility
            </Link>
          </NavItem>
          <NavItem>
            <Link to="service" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
              Service
            </Link>
          </NavItem>
          <NavItem>
            <Link to="contact" smooth={true} duration={500} onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </NavItem>
          <BookButton href="#book">Book Your Seat</BookButton>
        </NavLinks>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;