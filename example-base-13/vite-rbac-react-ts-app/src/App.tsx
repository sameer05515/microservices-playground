import RBACPracticeRoutes from "./routes";
import AppV12RoutesV1 from "./pages/APIV12Comps/v1/routes/AppRoutes";
import AppV12RoutesV2 from "./pages/APIV12Comps/v2/routes/AppRoutes";

const setting = {
  ShowRBACPracticeRoutes: false,
  ShowAppV12RoutesV1: false,
  ShowAppV12RoutesV2: true,
};

function App() {
  return (
    <>
      {setting.ShowAppV12RoutesV1 && <AppV12RoutesV1 />}
      {setting.ShowAppV12RoutesV2 && <AppV12RoutesV2 />}
      {setting.ShowRBACPracticeRoutes && <RBACPracticeRoutes />}
    </>
  );
}

export default App;
