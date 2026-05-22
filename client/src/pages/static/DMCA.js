import React, { useEffect } from "react";
import gsap from "gsap";
import Breadcrumb from "../../components/Breadcrumb";

const DMCA = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".content", { opacity: 1, y: 30, duration: 0.8 });
  }, []);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "DMCA" }]} />
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
        <h1 className="section-title">DMCA Notice & Takedown Policy</h1>
        <p>
          The Rising Bharat respects the intellectual property rights of others
          and expects its users to do the same.
        </p>
        <h2>Reporting Copyright Infringement</h2>
        <p>
          If you believe that your copyrighted work has been copied in a way
          that constitutes copyright infringement, please provide us with the
          following information:
        </p>
        <ul
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <li>
            A physical or electronic signature of the copyright owner or
            authorized representative
          </li>
          <li>
            Identification of the copyrighted work claimed to have been
            infringed
          </li>
          <li>
            Identification of the material that is claimed to be infringing
          </li>
          <li>
            Your contact information, including address, telephone number, and
            email
          </li>
          <li>
            A statement that you have a good faith belief that the use is not
            authorized
          </li>
          <li>
            A statement that the information in the notification is accurate
          </li>
        </ul>
        <h2>Submit a DMCA Notice</h2>
        <p>Please send your DMCA notice to: dmca@therisingbharat.com</p>
        <h2>Counter-Notification</h2>
        <p>
          If you believe that your content was removed due to a mistake or
          misidentification, you may submit a counter-notification with the
          required details.
        </p>
      </div>
    </div>
  );
};

export default DMCA;
