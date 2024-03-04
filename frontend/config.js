// config.js
const config = {
	serverApiUrl: process.env.NEXT_PUBLIC_API_URL+"api/" || `http://localhost:8080/api/`,
	cookieName: "social-network",
  };
  
export default config; 
