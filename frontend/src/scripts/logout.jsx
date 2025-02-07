import { Navigate } from "react-router-dom";

const Logout = ({ logout }) => {
    logout();

    return <Navigate to="/" />;
};

export default Logout; 