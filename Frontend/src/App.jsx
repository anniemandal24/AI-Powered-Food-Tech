import AuthProvider from "./context/AuthContext";
import AppRoutes from "./routes";

function App() {
  return (
    <AuthProvider>   
      {/* AppRoutes contains your <Routes> and is the traffic controller */}
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;