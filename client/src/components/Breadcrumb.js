import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumb container">
      <Link to="/">Home</Link>
      {items.map((item, index) => (
        <span key={index}>
          <span>/</span>
          {item.path ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
