import RBACWrapper from "../components/RBACWrapper";

const AdminPage = () => {
  return (
    <RBACWrapper allowedRoles={["admin"]}>
      <h1 className="text-xl font-bold text-green-600">Welcome, Admin! ✅</h1>
    </RBACWrapper>
  );
};

export default AdminPage;
