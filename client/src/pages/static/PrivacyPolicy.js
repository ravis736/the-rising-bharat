import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".content", {
      opacity: 1,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      <div
        className="content"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 0",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--text-secondary)",
        }}
      >
        <h1 className="section-title">Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as your name,
          email address, and profile information when you register or subscribe.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the collected data to provide, maintain, and improve our
          services, send newsletters, and personalize your experience.
        </p>
        <h2>Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our website and hold certain information to improve your browsing
          experience.
        </p>
        <h2>Third-Party Services</h2>
        <p>
          We may employ third-party companies and individuals to facilitate our
          website, provide analytics, or assist in analyzing how our service is
          used.
        </p>
        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction.
        </p>
        <h2>Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. You can manage your account settings at any time.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at privacy@therisingbharat.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
