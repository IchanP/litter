import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// style
import "../style/LoginButton.css";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className="login-button" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;
