import { CircularProgress } from "@mui/material";
import { useAuth } from "../component/AuthContext";
import SidebarLayout from "../component/SidebarLayout";

export default function ProfilePage() {
    const { currUser, loading } = useAuth();
    if (loading || !currUser) {
        return (
            <div className="LoaderContainer">
                <div className="Loader">
                    <CircularProgress />
                </div>    
            </div>
            
        );
    }

    return (
        <SidebarLayout currUser={currUser}>
            <h2>Welcome to your profile,</h2>
            <p><b>Email: {currUser.email}</b></p>
            <p><b>Username: {currUser.username}</b></p>
        </SidebarLayout>
    );
}
