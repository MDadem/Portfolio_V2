import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import GrainOverlay from './GrainOverlay';

const Layout = ({ children }) => {
    return (
        <div
            style={{
                background: '#0B0D12',
                color: '#E5E5E5',
                fontFamily: "var(--font-body)",
                minHeight: '100vh',
                overflowX: 'hidden',
            }}
        >
            <GrainOverlay />
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
