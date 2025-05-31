import Sidebar from "./Sidebar";
import CloseIcon from '@mui/icons-material/Close';

export default function SidebarLayout({ currUser, children }) {


    return (
        <div className="profile-container">
            <input type="checkbox" id="menu-toggle" />

            <div className="sidebar">
                <label htmlFor="menu-toggle" className="Close" style={{ color: 'grey' }}>
                    <CloseIcon className="btn-one"/>
                </label>
                <div className="Profile sidebar-profile">
                    <i className="fa-solid fa-user" />
                </div>
                <b style={{ marginTop: '-4rem', fontSize: '1.3rem' }}>{currUser.role}</b>
                <Sidebar />
            </div>

            <div className="main-content">
               <label htmlFor="menu-toggle" className="btn-two">
                <i className="fa-solid fa-bars" style={{ color: 'black' }} />
            </label>
                {children}
            </div>
        </div>
    );
}
