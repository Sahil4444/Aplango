import { useNavigate, useLocation } from 'react-router-dom';

const SCROLL_TARGETS = {
  home: 0,
  vendors: 2110,
  about: 3210,
  contact: 4150,
};

export const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (section) => {
    const targetPosition = SCROLL_TARGETS[section];
    
    if (targetPosition === undefined) return;

    if (location.pathname === '/') {
      // Already on home page, just scroll
      window.scrollTo({
        top: targetPosition,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to home first, then scroll
      navigate('/');
      setTimeout(() => {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return { scrollToSection };
};
