import { RouterProvider } from "react-router-dom";
import { router } from "./router"; // import your router

function App() {
  return <RouterProvider router={router} />;
}

export default App;