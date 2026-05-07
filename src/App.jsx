import { useState, useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout/Layout';
import Hero from './components/Sections/Hero';
import CapabilitySignal from './components/Sections/CapabilitySignal';
import Manifesto from './components/Sections/Manifesto';
import Approach from './components/Sections/Approach';
import Projects from './components/Sections/Projects';
import AlgoArena from './components/Sections/AlgoArena';
import Performance from './components/Sections/Performance';
import Differentiation from './components/Sections/Differentiation';
import Footer from './components/Layout/Footer';
import TrackingProvider from './tracker/TrackingProvider';

const Panel = lazy(() => import('./panel/Panel'));

function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Panel route
  if (route.startsWith('/panel')) {
    return (
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0b0f', color: '#6b7280', fontFamily: "'Space Grotesk', sans-serif" }}>
          Loading Panel...
        </div>
      }>
        <Panel />
      </Suspense>
    );
  }

  // Portfolio route
  return (
    <TrackingProvider>
      <Layout>
        <Hero />
        <CapabilitySignal />
        <Manifesto />
        <Approach />
        <Projects />
        <AlgoArena />
        <Performance />
        <Differentiation />
        <Footer />
      </Layout>
    </TrackingProvider>
  )
}

export default App
