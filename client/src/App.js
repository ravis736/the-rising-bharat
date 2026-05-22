import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import SEO from './components/SEO';
import JsonLd from './components/JsonLd';
import './styles/global.css';

// Lazy loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const About = lazy(() => import('./pages/static/About'));
const Contact = lazy(() => import('./pages/static/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/static/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/static/TermsConditions'));
const Disclaimer = lazy(() => import('./pages/static/Disclaimer'));
const Advertise = lazy(() => import('./pages/static/Advertise'));
const Authors = lazy(() => import('./pages/static/Authors'));
const DMCA = lazy(() => import('./pages/static/DMCA'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const StaffLogin = lazy(() => import('./pages/staff/StaffLogin'));
const StaffRegister = lazy(() => import('./pages/staff/StaffRegister'));
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));
const StaffList = lazy(() => import('./pages/staff/StaffList'));
const NewBlog = lazy(() => import('./pages/staff/NewBlog'));
const EditBlog = lazy(() => import('./pages/staff/EditBlog'));
const StaffBlogs = lazy(() => import('./pages/staff/StaffBlogs'));
const TagPage = lazy(() => import('./pages/TagPage'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));

const PageLoader = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '60vh', fontSize: '1.2rem', color: 'var(--text-muted)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div className="loader-bar" style={{ width: '150px', margin: '0 auto 15px' }}>
        <div className="loader-bar-inner" />
      </div>
      Loading...
    </div>
  </div>
);

function App() {
  const [lang, setLang] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <SEO />
            <JsonLd />
            {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
            <CustomCursor />
            <Header lang={lang} setLang={setLang} />
            <BackToTop />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} lang={lang} />
            <main style={{ minHeight: '80vh', paddingTop: '20px' }}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home lang={lang} />} />
                  <Route path="/blog/:id" element={<BlogDetail lang={lang} />} />
                  <Route path="/category/:category" element={<CategoryPage lang={lang} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/advertise" element={<Advertise />} />
                  <Route path="/authors" element={<Authors />} />
                  <Route path="/dmca" element={<DMCA />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/staff/login" element={<StaffLogin />} />
                  <Route path="/staff/register" element={<StaffRegister />} />
                  <Route path="/staff/dashboard" element={<StaffDashboard />} />
                  <Route path="/staff/list" element={<StaffList />} />
                  <Route path="/staff/new-blog" element={<NewBlog />} />
                  <Route path="/staff/edit-blog/:id" element={<EditBlog />} />
                  <Route path="/staff/blogs" element={<StaffBlogs />} />
                  <Route path="/tag/:tag" element={<TagPage />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                </Routes>
              </Suspense>
            </main>
            <Footer lang={lang} />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
