import React from 'react';
import { Outlet, Link } from 'react-router-dom';

/**
 * Clean placeholder layout for Admin platform rebuild.
 * Provides an unstyled, functional placeholder for /admin routes.
 */
export const AdminPlaceholderLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0b0f17', color: '#f8fafc' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem', borderRadius: '1rem', background: '#111827' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#f59e0b' }}>
          Maestro Administration Platform
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Legacy admin UI code has been safely purged. The system is prepared for a clean rebuild based on <code style={{ color: '#38bdf8' }}>ADMIN_SPEC.md</code>.
        </p>
        <Link
          to="/"
          style={{ display: 'inline-block', padding: '0.625rem 1.25rem', backgroundColor: '#f59e0b', color: '#000', borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none' }}
        >
          Return to Storefront
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminPlaceholderLayout;
