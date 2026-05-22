import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";

const TermsConditions = () => {
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
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
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
        <h1 className="section-title">Terms and Conditions</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using The Rising Bharat website, you agree to be
          bound by these Terms and Conditions.
        </p>
        <h2>User Responsibilities</h2>
        <p>
          Users agree to use the website for lawful purposes only and not to
          violate any laws or regulations. You must not post false, misleading,
          or harmful content.
        </p>
        <h2>Intellectual Property</h2>
        <p>
          All content published on this website, including text, images,
          graphics, and logos, is the property of The Rising Bharat unless
          otherwise stated.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          The Rising Bharat shall not be liable for any direct, indirect,
          incidental, or consequential damages arising from the use of this
          website.
        </p>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will
          be effective immediately upon posting.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
