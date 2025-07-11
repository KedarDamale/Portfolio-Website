import React, { useState, useRef, useEffect } from 'react';

const menuItems = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Contact', href: '#' },
];

const HamburgerIcon = ({ open }) => (
  <span style={{
    display: 'inline-block',
    width: 28,
    height: 22,
    position: 'relative',
    verticalAlign: 'middle',
  }}>
    <span style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: 4,
      borderRadius: 2,
      background: '#fff',
      transition: '0.3s',
      transform: open ? 'rotate(45deg) translateY(9px)' : 'none',
    }} />
    <span style={{
      position: 'absolute',
      left: 0,
      top: 9,
      width: '100%',
      height: 4,
      borderRadius: 2,
      background: '#fff',
      opacity: open ? 0 : 1,
      transition: '0.3s',
    }} />
    <span style={{
      position: 'absolute',
      left: 0,
      top: 18,
      width: '100%',
      height: 4,
      borderRadius: 2,
      background: '#fff',
      transition: '0.3s',
      transform: open ? 'rotate(-45deg) translateY(-9px)' : 'none',
    }} />
  </span>
);

const navStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '56px',
  background: 'transparent',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  zIndex: 10,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)'
};

const titleStyles = {
  fontWeight: 700,
  fontSize: '1.5rem',
  letterSpacing: '0.05em',
  flex: 1,
  textAlign: 'left',
  transition: 'text-align 0.2s',
};

const menuButtonStyles = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '1.2rem',
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
  minWidth: 44,
  minHeight: 44,
  zIndex: 20,
};

const dropdownStyles = {
  position: 'absolute',
  right: 0,
  top: '110%',
  background: 'rgba(30,41,59,0.98)',
  color: '#fff',
  minWidth: '140px',
  borderRadius: '8px',
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
  listStyle: 'none',
  margin: 0,
  padding: '0.5rem 0',
  zIndex: 100,
  touchAction: 'manipulation',
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={{
      ...navStyles,
      flexDirection: isMobile ? 'row' : 'row',
      padding: isMobile ? '0 1rem' : '0 2rem',
      height: isMobile ? 48 : 56,
    }}>
      <div
        style={{
          ...titleStyles,
          textAlign: isMobile ? 'center' : 'left',
          fontSize: isMobile ? '1.15rem' : '1.5rem',
          paddingLeft: isMobile ? 0 : undefined,
        }}
      >
        Kedar.
      </div>
      <div style={{ position: 'relative', flex: isMobile ? 0 : undefined }} ref={menuRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            ...menuButtonStyles,
            padding: isMobile ? '0.5rem' : '0.5rem 1rem',
            minWidth: isMobile ? 36 : 44,
            minHeight: isMobile ? 36 : 44,
          }}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <HamburgerIcon open={open} />
        </button>
        {open && (
          <ul
            style={{
              ...dropdownStyles,
              right: isMobile ? 0 : 0,
              top: isMobile ? '110%' : '110%',
              minWidth: isMobile ? 120 : 140,
            }}
          >
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: isMobile ? '0.5rem 1rem' : '0.5rem 1.2rem',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    transition: 'background 0.18s',
                    fontSize: isMobile ? '1rem' : '1.08rem',
                  }}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 