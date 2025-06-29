import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
