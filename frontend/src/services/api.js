import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ User Endpoints ============
export const createUser = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const loginUser = async (email = null, name = null) => {
  const params = {};
  if (email) params.email = email;
  if (name) params.name = name;
  const response = await api.post('/users/login', null, { params });
  return response.data;
};

export const getAllUsers = async (role = null) => {
  const params = role ? { role } : {};
  const response = await api.get('/users/', { params });
  return response.data;
};

// ============ Trial Endpoints ============
export const createTrial = async (trialData) => {
  const response = await api.post('/trials/', trialData);
  return response.data;
};

export const getTrials = async (condition = null, location = null) => {
  const params = {};
  if (condition) params.condition = condition;
  if (location) params.location = location;
  const response = await api.get('/trials/', { params });
  return response.data;
};

export const getTrial = async (trialId) => {
  const response = await api.get(`/trials/${trialId}`);
  return response.data;
};

export const updateTrial = async (trialId, trialData) => {
  const response = await api.put(`/trials/${trialId}`, trialData);
  return response.data;
};

export const deleteTrial = async (trialId) => {
  const response = await api.delete(`/trials/${trialId}`);
  return response.data;
};

// ============ Publication Endpoints ============
export const createPublication = async (publicationData) => {
  const response = await api.post('/publications/', publicationData);
  return response.data;
};

export const getPublications = async (researcherId = null) => {
  const params = researcherId ? { researcher_id: researcherId } : {};
  const response = await api.get('/publications/', { params });
  return response.data;
};

export const getPublication = async (publicationId) => {
  const response = await api.get(`/publications/${publicationId}`);
  return response.data;
};

export const updatePublication = async (publicationId, publicationData) => {
  const response = await api.put(`/publications/${publicationId}`, publicationData);
  return response.data;
};

export const deletePublication = async (publicationId) => {
  const response = await api.delete(`/publications/${publicationId}`);
  return response.data;
};

// ============ Forum Endpoints ============
export const createForumPost = async (postData) => {
  const response = await api.post('/forum/', postData);
  return response.data;
};

export const getForumPosts = async (authorId = null) => {
  const params = authorId ? { author_id: authorId } : {};
  const response = await api.get('/forum/', { params });
  return response.data;
};

export const getForumPost = async (postId) => {
  const response = await api.get(`/forum/${postId}`);
  return response.data;
};

export const deleteForumPost = async (postId) => {
  const response = await api.delete(`/forum/${postId}`);
  return response.data;
};

// ============ AI Endpoints ============
export const summarizeText = async (text) => {
  const response = await api.post('/ai/summarize', { text });
  return response.data;
};

export const extractConditions = async (symptoms) => {
  const response = await api.post('/ai/extract-conditions', null, { 
    params: { symptoms } 
  });
  return response.data;
};

export const matchExperts = async (condition, symptoms = "") => {
  const response = await api.post('/ai/match-experts', null, { 
    params: { condition, symptoms } 
  });
  return response.data;
};

export const analyzeEligibility = async (patient_age, patient_condition, patient_symptoms, trial_criteria) => {
  const response = await api.post('/ai/analyze-eligibility', null, {
    params: {
      patient_age,
      patient_condition,
      patient_symptoms,
      trial_criteria
    }
  });
  return response.data;
};

export const checkAIHealth = async () => {
  const response = await api.get('/ai/health');
  return response.data;
};

// ============ Connection Endpoints ============
export const createConnection = async (connectionData) => {
  const response = await api.post('/connections/', connectionData);
  return response.data;
};

export const getConnections = async (userId = null, status = null) => {
  const params = {};
  if (userId) params.user_id = userId;
  if (status) params.status = status;
  const response = await api.get('/connections/', { params });
  return response.data;
};

export const updateConnection = async (connectionId, status) => {
  const response = await api.put(`/connections/${connectionId}`, { status });
  return response.data;
};

export const getCollaborators = async (userId, specialty = null) => {
  const params = specialty ? { specialty } : {};
  const response = await api.get(`/connections/collaborators/${userId}`, { params });
  return response.data;
};

export const getHealthExperts = async (condition = null, location = null) => {
  const params = {};
  if (condition) params.condition = condition;
  if (location) params.location = location;
  const response = await api.get('/connections/experts', { params });
  return response.data;
};

// ============ Meeting Request Endpoints ============
export const createMeetingRequest = async (meetingData) => {
  const response = await api.post('/meetings/', meetingData);
  return response.data;
};

export const getMeetingRequests = async (userId = null, status = null) => {
  const params = {};
  if (userId) params.user_id = userId;
  if (status) params.status = status;
  const response = await api.get('/meetings/', { params });
  return response.data;
};

export const updateMeetingRequest = async (meetingId, status) => {
  const response = await api.put(`/meetings/${meetingId}`, { status });
  return response.data;
};

// ============ External API Endpoints ============
export const searchPubMed = async (query, maxResults = 10) => {
  const response = await api.get('/external/pubmed/search', {
    params: { query, max_results: maxResults }
  });
  return response.data;
};

export const searchClinicalTrials = async (condition, status = null, maxResults = 10) => {
  const params = { condition, max_results: maxResults };
  if (status) params.status = status;
  const response = await api.get('/external/clinicaltrials/search', { params });
  return response.data;
};

export const getORCIDPublications = async (orcidId) => {
  const response = await api.get(`/external/orcid/${orcidId}`);
  return response.data;
};

// Export default object with all methods
export default {
  createUser,
  getUser,
  updateUser,
  loginUser,
  getAllUsers,
  createTrial,
  getTrials,
  getTrial,
  updateTrial,
  deleteTrial,
  createPublication,
  getPublications,
  getPublication,
  updatePublication,
  deletePublication,
  createForumPost,
  getForumPosts,
  getForumPost,
  deleteForumPost,
  summarizeText,
  checkAIHealth,
  createConnection,
  getConnections,
  updateConnection,
  getCollaborators,
  getHealthExperts,
  createMeetingRequest,
  getMeetingRequests,
  updateMeetingRequest,
  searchPubMed,
  searchClinicalTrials,
  getORCIDPublications,
};
