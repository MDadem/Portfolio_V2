import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import GrainOverlay from './GrainOverlay';
import AuroraBackground from '../UI/AuroraBackground';

const Layout = ({ children }) => {
    return (
        <div
            style={{
                background: '#050608',
                color: '#E5E5E5',
                fontFamily: "var(--font-body)",
                minHeight: '100vh',
                overflowX: 'hidden',
                position: 'relative',
            }}
        >
            <AuroraBackground />
            <GrainOverlay />
            <CustomCursor />
            <Navbar />
            <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>
        </div>
    );
};

export default Layout;
