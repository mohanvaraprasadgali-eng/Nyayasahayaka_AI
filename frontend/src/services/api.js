/**
 * NyayaAI - API Client Service
 * Secure Legal Rights & Lawyer Assistance Platform
 */

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('nyaya_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication & Demo Personas
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  async register(formData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getDemoUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      return await res.json();
    } catch (e) {
      return { success: false, demo_users: [] };
    }
  },

  // Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        stats: {
          total_cases: 2,
          total_documents: 3,
          pending_actions: 4,
          upcoming_deadlines: 2,
          evidence_collected_percentage: 80
        }
      };
    }
  },

  // Problem Analysis
  async analyzeProblem(problem, language = 'en', state = 'Telangana') {
    const res = await fetch(`${API_BASE}/analyze-problem`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ problem, language, state })
    });
    return await res.json();
  },

  // Document Analysis
  async analyzeDocument(text, filename = 'document.txt', document_type = null) {
    const res = await fetch(`${API_BASE}/analyze-document`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, filename, document_type })
    });
    return await res.json();
  },

  // Document Generator
  async getDocumentTemplates() {
    const res = await fetch(`${API_BASE}/document-templates`);
    return await res.json();
  },

  async generateDocument(template_id, fields, case_id = null, save_to_case = false) {
    const res = await fetch(`${API_BASE}/generate-document`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ template_id, fields, case_id, save_to_case })
    });
    return await res.json();
  },

  // Cases CRUD & Matching
  async getCases() {
    const res = await fetch(`${API_BASE}/cases`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getCaseDetail(caseId) {
    const res = await fetch(`${API_BASE}/cases/${caseId}`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async createCase(caseData) {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(caseData)
    });
    return await res.json();
  },

  async acceptCase(caseId) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async declineCase(caseId) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/decline`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getMatchingLawyers(caseId) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/matching-lawyers`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getMissingGuidance(caseId, documentName) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/missing-guidance?document_name=${encodeURIComponent(documentName)}`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async updateDocRequirement(caseId, reqId, status, userNotes = '') {
    const res = await fetch(`${API_BASE}/cases/${caseId}/document-requirement/${reqId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, user_notes: userNotes })
    });
    return await res.json();
  },

  // Secure Documents & Vault
  async getCaseDocuments(caseId) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/documents`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getCitizenVault() {
    const res = await fetch(`${API_BASE}/citizen/document-vault`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async uploadCaseDocument(caseId, formData) {
    const token = localStorage.getItem('nyaya_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/cases/${caseId}/documents`, {
      method: 'POST',
      headers,
      body: formData
    });
    return await res.json();
  },

  async getSecureDocument(caseId, docId, download = false) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/documents/${docId}?download=${download}`, { headers: getAuthHeaders() });
    return await res.json();
  },

  // Private Chat
  async getCaseMessages(caseId) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/messages`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async sendCaseMessage(caseId, messageText, attachmentDocId = null) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message_text: messageText, attachment_doc_id: attachmentDocId })
    });
    return await res.json();
  },

  // Lawyer Platform
  async getLawyerProfile() {
    const res = await fetch(`${API_BASE}/lawyers/profile`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getLawyerCaseRequests() {
    const res = await fetch(`${API_BASE}/lawyers/case-requests`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getLawyerActiveCases() {
    const res = await fetch(`${API_BASE}/lawyers/active-cases`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getLawyerStats() {
    const res = await fetch(`${API_BASE}/lawyers/stats`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async uploadLawyerVerification(docType, fileName) {
    const res = await fetch(`${API_BASE}/lawyers/verification`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ document_type: docType, file_name: fileName })
    });
    return await res.json();
  },

  // Subscriptions
  async getCurrentSubscription() {
    const res = await fetch(`${API_BASE}/subscriptions/current`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getSubscriptionPlans() {
    const res = await fetch(`${API_BASE}/subscriptions/plans`);
    return await res.json();
  },

  async renewSubscription(planName, price, durationMonths) {
    const res = await fetch(`${API_BASE}/subscriptions/renew`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ plan_name: planName, price, duration_months: durationMonths })
    });
    return await res.json();
  },

  // Payments & Pricing
  async getPricingPlans() {
    const res = await fetch(`${API_BASE}/pricing-plans`);
    return await res.json();
  },

  async processMockPayment(paymentType, amount, caseId = null, planCode = null, paymentMethod = 'Mock UPI Simulation') {
    const res = await fetch(`${API_BASE}/payments/mock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        payment_type: paymentType,
        amount,
        case_id: caseId,
        plan_code: planCode,
        payment_method: paymentMethod
      })
    });
    return await res.json();
  },

  async getPaymentHistory() {
    const res = await fetch(`${API_BASE}/payments/history`, { headers: getAuthHeaders() });
    return await res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async markNotificationRead(noteId) {
    const res = await fetch(`${API_BASE}/notifications/${noteId}/read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getPendingLawyers() {
    const res = await fetch(`${API_BASE}/admin/lawyers/pending`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async getAllLawyers() {
    const res = await fetch(`${API_BASE}/admin/lawyers`, { headers: getAuthHeaders() });
    return await res.json();
  },

  async approveLawyer(lawyerId, notes = '') {
    const res = await fetch(`${API_BASE}/admin/lawyers/${lawyerId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    });
    return await res.json();
  },

  async rejectLawyer(lawyerId, reason = '') {
    const res = await fetch(`${API_BASE}/admin/lawyers/${lawyerId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return await res.json();
  },

  async suspendLawyer(lawyerId, reason = '') {
    const res = await fetch(`${API_BASE}/admin/lawyers/${lawyerId}/suspend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return await res.json();
  },

  async updatePricingPlan(planId, price, description, isActive = 1) {
    const res = await fetch(`${API_BASE}/admin/pricing/${planId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ price, description, is_active: isActive })
    });
    return await res.json();
  },

  async getAuditLogs(action = null, role = null) {
    let url = `${API_BASE}/admin/audit-logs?limit=50`;
    if (action) url += `&action=${encodeURIComponent(action)}`;
    if (role) url += `&role=${encodeURIComponent(role)}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return await res.json();
  },

  // Legal Aid & Sources
  async getAuthorities(category = 'All', state = 'All', is_legal_aid = null) {
    let url = `${API_BASE}/authorities?category=${encodeURIComponent(category)}&state=${encodeURIComponent(state)}`;
    if (is_legal_aid !== null) url += `&is_legal_aid=${is_legal_aid}`;
    const res = await fetch(url);
    return await res.json();
  },

  async getLegalSources() {
    const res = await fetch(`${API_BASE}/legal-sources`);
    return await res.json();
  },

  async checkLegalAidEligibility(formData) {
    const res = await fetch(`${API_BASE}/check-legal-aid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return await res.json();
  },

  // Existing Evidence & Actions Helpers
  async getEvidence(caseId = null) {
    const url = caseId ? `${API_BASE}/evidence?case_id=${caseId}` : `${API_BASE}/evidence`;
    const res = await fetch(url);
    return await res.json();
  },

  async getActionSteps(caseId = null) {
    const url = caseId ? `${API_BASE}/action-steps?case_id=${caseId}` : `${API_BASE}/action-steps`;
    const res = await fetch(url);
    return await res.json();
  },

  async getReminders(caseId = null) {
    const url = caseId ? `${API_BASE}/reminders?case_id=${caseId}` : `${API_BASE}/reminders`;
    const res = await fetch(url);
    return await res.json();
  }
};
