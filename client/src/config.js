const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://wedly-app.onrender.com'
    : 'http://localhost:4000';

export default BASE_URL;
