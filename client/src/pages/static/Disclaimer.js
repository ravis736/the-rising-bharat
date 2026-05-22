import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".content", { opacity: 1, y: 30, duration: 0.8 });
  }, []);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Disclaimer" }]} />
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
        <h1 className="section-title">Disclaimer</h1>
        <p>
          The information provided on The Rising Bharat is for general
          informational and educational purposes only.
        </p>
        <h2>Accuracy of Information</h2>
        <p>
          While we strive to provide accurate and up-to-date information, we
          make no representations or warranties of any kind regarding the
          completeness, accuracy, or reliability of any content.
        </p>
        <h2>External Links</h2>
        <p>
          Our website may contain links to external websites. We are not
          responsible for the content or practices of these third-party sites.
        </p>
        <h2>Professional Advice</h2>
        <p>
          The content on this website should not be considered as professional
          advice. Always consult qualified professionals for specific guidance.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          The Rising Bharat will not be liable for any losses or damages arising
          from the use of this website or reliance on its content.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
