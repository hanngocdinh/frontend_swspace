import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f7;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
`;

const Input = styled.input`
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
`;

const SubmitButton = styled.button`
  background-color: #45bf55;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #38a046;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`;

const SwitchContainer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #555;
`;

const SwitchLink = styled.span`
  color: #45bf55;
  cursor: pointer;
  font-weight: 500;
  margin-left: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const DemoMessage = styled.div`
  background-color: #f8f9fa;
  border-left: 4px solid #45bf55;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #333;
`;

const LoginPage = () => {
  // State cho form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy redirect path từ location state hoặc mặc định là '/'
  const redirectTo = location.state?.from || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Xóa thông báo lỗi khi người dùng thay đổi input
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isRegisterMode) {
      // Đây chỉ là demo, nên thông báo không hỗ trợ đăng ký
      setError('Registration is not available in this demo. Please use the demo accounts.');
      setIsLoading(false);
    } else {
      const { username, password } = formData;
      
      const result = login(username, password);
      
      if (result.success) {
        // Nếu đăng nhập thành công, chuyển đến trang redirect
        navigate(redirectTo);
      } else {
        setError(result.message);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <LoginContainer>
          <FormTitle>{isRegisterMode ? 'Create an Account' : 'Sign In'}</FormTitle>
          
          <DemoMessage>
            <strong>Demo Accounts:</strong><br />
            Username: hanne, Password: password123<br />
            Username: john, Password: password123
          </DemoMessage>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </FormGroup>
            
            {isRegisterMode && (
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </FormGroup>
            )}
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : isRegisterMode
                ? 'Create Account'
                : 'Sign In'}
            </SubmitButton>
          </Form>
          
          <SwitchContainer>
            {isRegisterMode
              ? 'Already have an account?'
              : "Don't have an account?"}
            <SwitchLink onClick={() => setIsRegisterMode(!isRegisterMode)}>
              {isRegisterMode ? 'Sign In' : 'Create Account'}
            </SwitchLink>
          </SwitchContainer>
        </LoginContainer>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

export default LoginPage;
