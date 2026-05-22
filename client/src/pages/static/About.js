import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".about-content", {
      opacity: 1,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "About Us" }]} />
      <div
        className="about-content"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 0" }}
      >
        <h1 className="section-title">About The Rising Bharat</h1>
        <div
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <p>
            Welcome to <strong>The Rising Bharat</strong>, your trusted source
            for news, insights, and stories that matter. We are committed to
            delivering high-quality, informative, and engaging content across a
            wide range of categories including technology, business, lifestyle,
            sports, education, and more.
          </p>
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "1.4rem",
              marginTop: "20px",
            }}
          >
            Our Mission
          </h2>
          <p>
            Our mission is to inform, educate, and inspire our readers by
            providing accurate, timely, and well-researched content. We believe
            in the power of information and strive to be a platform where
            knowledge meets curiosity.
          </p>
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "1.4rem",
              marginTop: "20px",
            }}
          >
            Our Vision
          </h2>
          <p>
            We envision a world where quality information is accessible to
            everyone. The Rising Bharat aims to bridge the gap between news and
            understanding, making complex topics simple and engaging for all
            readers.
          </p>
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "1.4rem",
              marginTop: "20px",
            }}
          >
            What We Cover
          </h2>
          <p>
            From breaking news and in-depth analysis to lifestyle tips and
            educational resources, we cover a diverse range of topics. Our team
            of dedicated writers and editors work tirelessly to bring you
            content that is not only informative but also engaging and
            thought-provoking.
          </p>
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "1.4rem",
              marginTop: "20px",
            }}
          >
            Our Commitment
          </h2>
          <p>
            We are committed to journalistic integrity, factual accuracy, and
            ethical reporting. Every piece of content published on The Rising
            Bharat undergoes rigorous verification to ensure it meets our high
            standards of quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
