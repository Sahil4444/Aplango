/**
 * Check if user is logged in as admin
 * @returns {boolean} True if admin is logged in
 */
export const isAdminLoggedIn = () => {
  const adminUser = localStorage.getItem('adminUser');
  return !!adminUser;
};

/**
 * Get the current admin user data
 * @returns {Object|null} Admin user data or null if not logged in
 */
export const getAdminUser = () => {
  const adminUser = localStorage.getItem('adminUser');
  if (!adminUser) return null;
  
  try {
    return JSON.parse(adminUser);
  } catch (error) {
    console.error('Error parsing admin user data:', error);
    return null;
  }
};

/**
 * Log out the admin user
 */
export const logoutAdmin = () => {
  localStorage.removeItem('adminUser');
};
