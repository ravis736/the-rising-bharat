import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";
import { FiUser } from "react-icons/fi";

const teamMembers = [
  {
    name: "Ravi Kumar",
    role: "Founder & Editor-in-Chief",
    bio: "Experienced journalist and content strategist with a passion for delivering quality news and insights.",
    expertise: "Technology, Business, Politics",
  },
  {
    name: "Priya Sharma",
    role: "Senior Editor",
    bio: "Senior editor specializing in lifestyle, culture, and entertainment content.",
    expertise: "Lifestyle, Entertainment, Culture",
  },
  {
    name: "Amit Singh",
    role: "Technology Lead",
    bio: "Tech enthusiast covering the latest in AI, gadgets, and digital innovation.",
    expertise: "AI, Technology, Gaming",
  },
  {
    name: "Sneha Patel",
    role: "Sports Editor",
    bio: "Covering major sports events, cricket, football, and athletic achievements worldwide.",
    expertise: "Sports, Athletics",
  },
  {
    name: "Vikram Joshi",
    role: "Education & Careers Editor",
    bio: "Dedicated to providing valuable educational resources and career guidance.",
    expertise: "Education, Career Development",
  },
  {
    name: "Neha Gupta",
    role: "Content Writer",
    bio: "Creative writer focused on health, fitness, and wellness topics.",
    expertise: "Health, Fitness, Wellness",
  },
];

const Authors = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".team-card", {
      opacity: 1,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Our Team" }]} />
      <div style={{ padding: "40px 0" }}>
        <h1 className="section-title">Our Team</h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "40px",
            maxWidth: "700px",
          }}
        >
          Meet the dedicated team of writers, editors, and contributors behind
          The Rising Bharat.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="team-card card"
              style={{ padding: "25px" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  marginBottom: "15px",
                }}
              >
                <FiUser />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {member.name}
              </h3>
              <p
                style={{
                  color: "var(--accent)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  marginBottom: "10px",
                }}
              >
                {member.bio}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Expertise: {member.expertise}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Authors;
