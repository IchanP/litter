import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

const Auth0SignupHandler = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const checkAndRegisterUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          
          // First, check if user exists in your database
          const checkResponse = await fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/users/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // If user is not found (404), register them
          if (checkResponse.status === 404) {
            setIsNewUser(true);
            await registerUserInDatabase(user, token);
          }
          
        } catch (error) {
          console.error('Error checking/registering user:', error);
        }
      }
    };

    const registerUserInDatabase = async (user, token) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/write/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              userId: user.sub,
              email: user.email,
              username: user.name,
            })
          });
    
          if (!response.ok) {
            throw new Error('Failed to register user in database');
          }
    
          console.log('User registered successfully');
        } catch (error) {
          console.error('Error registering user:', error);
          // Handle registration error appropriately
        }
      };

    checkAndRegisterUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);


  // You can use isNewUser state to show different UI for new users
  return (
    <></>
  );
};

export default Auth0SignupHandler;