
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

function App() {
  return (
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
  )
}

export default App
