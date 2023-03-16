const HOST = process.env.API_HOST || 'http://localhost:8082/';
const API_HOST = process.env.API_HOST || 'http://localhost:8082/';
const IMAGE_HOST = process.env.IMAGE_HOST || 'http://localhost:8082/';
const AUDIO_HOST = process.env.AUDIO_HOST || 'http://localhost:8082/';
export { API_HOST, IMAGE_HOST, AUDIO_HOST };
export default HOST;
