import SEOHead from './components/SEOHead'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import PackageList from './components/PackageList'
import GalleryGrid from './components/GalleryGrid'
import LocationSection from './components/LocationSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <SEOHead />
      <Navbar />
      <main>
        <Hero />
        <About />
        <PackageList />
        <GalleryGrid />
        <LocationSection />
      </main>
      <Footer />
    </>
  )
}
