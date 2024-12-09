export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const handleApiError = (error) => {
  console.error('API Error:', error);
  throw new Error('An error occurred while fetching data');
};