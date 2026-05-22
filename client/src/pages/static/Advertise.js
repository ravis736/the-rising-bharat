import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";

const Advertise = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".content", { opacity: 1, y: 30, duration: 0.8 });
  }, []);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Advertise With Us" }]} />
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
        <h1 className="section-title">Advertise With Us</h1>
        <p>
          Reach a growing audience of informed readers across India and beyond.
          The Rising Bharat offers various advertising opportunities to promote
          your brand, products, or services.
        </p>
        <h2>Why Advertise With Us?</h2>
        <ul
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <li>Targeted audience of news and content enthusiasts</li>
          <li>High engagement and visibility across categories</li>
          <li>Flexible advertising options to suit your budget</li>
          <li>Detailed analytics and performance reporting</li>
        </ul>
        <h2>Advertising Options</h2>
        <ul
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <li>Display Banner Ads</li>
          <li>Sponsored Content</li>
          <li>Newsletter Sponsorships</li>
          <li>Social Media Promotions</li>
        </ul>
        <p>
          For partnership inquiries, contact us at advertise@therisingbharat.com
        </p>
      </div>
    </div>
  );
};

export default Advertise;
