import { useEffect } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import CategorySection from '../components/CategorySection';
import ProductsSection from '../components/ProductsSection';
import SpecialityBanner from '../components/SpecialityBanner';
import GiftingSection from '../components/GiftingSection';
import StorySection from '../components/StorySection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import LocationModal from '../components/LocationModal';
import SearchModal from '../components/SearchModal';
import Toast from '../components/Toast';
import { useBakery } from '../context/BakeryContext';

export default function BakeryPage() {
  const { isCartOpen, isLocationModalOpen, isSearchModalOpen } = useBakery();

  useEffect(() => {
    const shouldLockScroll = isCartOpen || isLocationModalOpen || isSearchModalOpen;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isLocationModalOpen, isSearchModalOpen]);

  return (
    <div className="theobroma-app">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <CategorySection />
        <ProductsSection />
        <SpecialityBanner />
        <GiftingSection />
        <StorySection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
      <CartDrawer />
      <LocationModal />
      <SearchModal />
      <Toast />
    </div>
  );
}
