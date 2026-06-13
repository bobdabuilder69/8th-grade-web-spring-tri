import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./src/Homepage/Homepage.jsx";
import SignUp from "./src/SignUp/SignUp.jsx";
import MyNeighborhood from "./src/MyNeighborhood/MyNeighborhood.jsx";
import MyNeighborhoodDetails from "./src/MyNeighborhoodDetails/MyNeighborhoodDetails.jsx";
import NewRequest from "./src/NewRequest/NewRequest.jsx";
import ProtectedRoute from "./src/Functions/protectedroute.jsx";
import UpdatePassword from "./src/Functions/UpdatePassword";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/myneighborhood" element={<MyNeighborhood />} />
            <Route path="/updatepassword" element={<UpdatePassword />} />
            <Route
                path="/myneighborhooddetails"
                element={
                    <ProtectedRoute>
                        <MyNeighborhoodDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/newrequest"
                element={
                    <ProtectedRoute>
                        <NewRequest />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
