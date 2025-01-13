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
          if (!checkResponse.ok) {
            setIsNewUser(true);
            await registerUserInDatabase(user.sub, token);
          }
          
        } catch (error) {
          console.error('Error checking/registering user:', error);
        }
      }
    };

    checkAndRegisterUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const registerUserInDatabase = async (userId, token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/write/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
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
    }
  };

  return (
    <div>
      {isNewUser && (
        <div className="welcome-message">
          Welcome! Thanks for signing up.
        </div>
      )}
    </div>
  );
};

export default Auth0SignupHandler;