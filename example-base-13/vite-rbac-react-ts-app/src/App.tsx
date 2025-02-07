import RBACPracticeRoutes from "./routes";
import AppV12Routes from "./pages/APIV12Comps/v1/routes/AppRoutes";

const setting = {
  ShowRBACPracticeRoutes: false,
  ShowAppV12Routes: true,
};

function App() {
  return (
    <>
      {setting.ShowAppV12Routes && <AppV12Routes />}
      {setting.ShowRBACPracticeRoutes && <RBACPracticeRoutes />}
    </>
  );
}

export default App;
