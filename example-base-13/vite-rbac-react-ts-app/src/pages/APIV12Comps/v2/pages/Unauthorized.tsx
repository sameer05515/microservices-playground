import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container text-center mt-5">
      <h2 className="text-danger">🚫 Access Denied</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
