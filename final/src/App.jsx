import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage/Homepage.jsx";
import SignUp from "./SignUp/SignUp.jsx";
import MyNeighborhood from "./MyNeighborhood/MyNeighborhood.jsx";
import MyNeighborhoodDetails from "./MyNeighborhoodDetails/MyNeighborhoodDetails.jsx";
import NewRequest from "./NewRequest/NewRequest.jsx";

export default function App() {
  return (
    <Routes basename="/8th-grade-web-spring-tri/dist/">
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/myneighborhood" element={<MyNeighborhood />} />
      <Route path="/myneighborhooddetails" element={<MyNeighborhoodDetails />} />
      <Route path="/newrequest" element={<NewRequest />} />
    </Routes>
  );
}
