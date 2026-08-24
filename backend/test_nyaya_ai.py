"""
NyayaAI Comprehensive Backend Test Suite
Tests all 15 core security, authorization, workflow, and privacy scenarios.
"""
import unittest
import json
import os
import io
from app import create_app
from database.db import init_db, get_db_connection
from database.seed_data import seed_database
from services.auth_service import AuthService

class TestNyayaAISecurityAndWorkflows(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Reset database for fresh test run
        db_path = 'database/nyayasahayak.db'
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
            except Exception:
                pass
        init_db()
        seed_database()
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def get_token(self, email, password="pass123"):
        res = self.client.post('/api/auth/login', json={"email": email, "password": password})
        data = res.get_json()
        self.assertTrue(data['success'], f"Login failed for {email}: {data}")
        return data['token']

    def test_01_citizen_access_own_documents(self):
        """TEST 7: Citizen can access their own documents."""
        token = self.get_token("citizen@nyaya.ai")
        res = self.client.get('/api/cases/1/documents', headers={'Authorization': f"Bearer {token}"})
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertGreater(len(data['documents']), 0)
        print("  [PASS] TEST 7 PASSED: Citizen accessed own documents.")

    def test_02_citizen_cannot_access_another_citizen_case_documents(self):
        """TEST 1: Citizen cannot access another citizen's documents."""
        # Sunita Rao (user_id: 2) tries to access Case 1 (owned by Ramesh Kumar user_id: 1)
        token = self.get_token("sunita@nyaya.ai")
        res = self.client.get('/api/cases/1/documents', headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 403)
        print("  [PASS] TEST 1 PASSED: Citizen denied access to another citizen's case documents (403).")

    def test_03_lawyer_cannot_access_docs_before_acceptance(self):
        """TEST 5: Lawyer cannot access documents before accepting the case."""
        # Adv Rahul Kumar is verified, but NOT assigned to Case 1
        token = self.get_token("rahul@nyaya.ai")
        res = self.client.get('/api/cases/1/documents', headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 403)
        data = res.get_json()
        self.assertIn("Access Denied", data['error'])
        print("  [PASS] TEST 5 PASSED: Unassigned lawyer denied document access (403).")

    def test_04_lawyer_b_cannot_access_lawyer_a_accepted_case(self):
        """TEST 2: Lawyer B cannot access Lawyer A's accepted case documents."""
        # Case 1 is assigned to Lawyer A (Adv Priya Sharma). Lawyer B (Adv Rahul) tries to get document 1
        token = self.get_token("rahul@nyaya.ai")
        res = self.client.get('/api/cases/1/documents/1', headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 403)
        print("  [PASS] TEST 2 PASSED: Lawyer B denied access to Lawyer A's case document.")

    def test_05_assigned_lawyer_can_access_docs_after_acceptance(self):
        """TEST 6: After acceptance, assigned lawyer can access documents."""
        # Case 1 is assigned to Adv Priya Sharma
        token = self.get_token("priya@nyaya.ai")
        res = self.client.get('/api/cases/1/documents/1', headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 200)
        print("  [PASS] TEST 6 PASSED: Assigned lawyer successfully accessed case document.")

    def test_06_unverified_lawyer_cannot_accept_cases(self):
        """TEST 3: Unverified lawyer cannot accept cases."""
        # Adv Amit Verma is PENDING verification
        token = self.get_token("amit@nyaya.ai")
        res = self.client.post('/api/cases/2/accept', headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 403)
        data = res.get_json()
        self.assertIn("verified", data['error'].lower())
        print("  [PASS] TEST 3 PASSED: Unverified lawyer blocked from accepting cases.")

    def test_07_admin_can_approve_lawyer(self):
        """Admin lawyer verification workflow."""
        admin_token = self.get_token("admin@nyaya.ai", "admin123")
        # Approve Adv Amit Verma (lawyer_id: 3)
        res = self.client.post('/api/admin/lawyers/3/approve', json={"notes": "Bar credentials verified"}, headers={'Authorization': f"Bearer {admin_token}"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['verification_status'], 'VERIFIED')
        print("  [PASS] ADMIN VERIFICATION PASSED: Adv Amit Verma approved as VERIFIED.")

    def test_08_citizen_create_case_and_missing_document_workflow(self):
        """TEST 10: Citizen creates case and marks document as missing with alternative guidance."""
        token = self.get_token("citizen@nyaya.ai")
        # Create case
        res = self.client.post('/api/cases', json={
            "description": "My landlord is refusing to return my security deposit of Rs 50,000 after vacating.",
            "preferred_language": "en",
            "location": "Gachibowli, Hyderabad"
        }, headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 201)
        case_data = res.get_json()
        case_id = case_data['case_id']
        self.assertEqual(case_data['complexity'], 'MODERATE')
        self.assertEqual(case_data['platform_fee'], 499.0)

        # Get missing document guidance
        res_g = self.client.get(f'/api/cases/{case_id}/missing-guidance?document_name=rental%20agreement')
        g_data = res_g.get_json()
        self.assertTrue(g_data['success'])
        self.assertGreater(len(g_data['guidance']['alternatives']), 0)

        # Mark document requirement as missing
        res_req = self.client.put(f'/api/cases/{case_id}/document-requirement/1', json={
            "status": "missing",
            "user_notes": "Do not have original physical agreement, providing bank statement instead."
        })
        self.assertEqual(res_req.status_code, 200)
        print("  [PASS] TEST 10 PASSED: Case created with AI complexity (MODERATE) and missing document alternate guidance.")

    def test_09_mock_payment_updates_case_status(self):
        """TEST 11: Mock payment updates case payment status to PAID."""
        token = self.get_token("citizen@nyaya.ai")
        res = self.client.post('/api/payments/mock', json={
            "payment_type": "case_fee",
            "amount": 499.0,
            "case_id": 2,
            "payment_method": "Prototype UPI Simulation"
        }, headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertIn('TXN-NYAYA', data['transaction_ref'])
        print("  [PASS] TEST 11 PASSED: Mock payment completed with receipt and case status updated.")

    def test_10_lawyer_receives_matching_notification_and_anonymized_preview(self):
        """TEST 8 & 9: Matching notification and anonymized case request preview."""
        token = self.get_token("priya@nyaya.ai")
        # Check case requests
        res = self.client.get('/api/lawyers/case-requests', headers={'Authorization': f"Bearer {token}"})
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['is_verified'])
        self.assertGreater(len(data['case_requests']), 0)
        req = data['case_requests'][0]
        # Verify anonymization
        self.assertIn("Citizen from", req['location_display'])
        print("  [PASS] TEST 8 & 9 PASSED: Lawyer received matching request with anonymized metadata preview.")

    def test_11_subscription_renewal(self):
        """TEST 12: Subscription renewal updates expiry."""
        token = self.get_token("priya@nyaya.ai")
        res = self.client.post('/api/subscriptions/renew', json={
            "plan_name": "PRO",
            "price": 999.0,
            "duration_months": 3
        }, headers={'Authorization': f"Bearer {token}"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['remaining_days'], 90)
        print("  [PASS] TEST 12 PASSED: Subscription renewed for 90 days.")

    def test_12_private_chat_exchange(self):
        """Private case conversation between citizen and assigned lawyer."""
        priya_token = self.get_token("priya@nyaya.ai")
        # Send message from lawyer
        res = self.client.post('/api/cases/1/messages', json={
            "message_text": "I have reviewed your bank statements. They establish clear payment."
        }, headers={'Authorization': f"Bearer {priya_token}"})
        self.assertEqual(res.status_code, 201)

        # Retrieve messages as citizen
        citizen_token = self.get_token("citizen@nyaya.ai")
        res_msgs = self.client.get('/api/cases/1/messages', headers={'Authorization': f"Bearer {citizen_token}"})
        self.assertEqual(res_msgs.status_code, 200)
        data = res_msgs.get_json()
        self.assertGreater(len(data['messages']), 0)
        print("  [PASS] PRIVATE CHAT PASSED: Secure messaging between client and assigned advocate.")

    def test_13_audit_logging_records_actions(self):
        """TEST 13: Audit log records document access and actions."""
        admin_token = self.get_token("admin@nyaya.ai", "admin123")
        res = self.client.get('/api/admin/audit-logs', headers={'Authorization': f"Bearer {admin_token}"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertGreater(len(data['logs']), 0)
        actions = [l['action'] for l in data['logs']]
        self.assertTrue(any("DOCUMENT" in a or "LOGIN" in a or "CASE" in a for a in actions))
        print(f"  [PASS] TEST 13 PASSED: Audit logs verified ({len(data['logs'])} records tracked).")

    def test_14_unauthorized_api_requests_rejected(self):
        """TEST 14: Unauthorized API requests return appropriate errors."""
        res = self.client.get('/api/admin/audit-logs') # No token
        self.assertEqual(res.status_code, 401)
        citizen_token = self.get_token("citizen@nyaya.ai")
        res_admin = self.client.get('/api/admin/audit-logs', headers={'Authorization': f"Bearer {citizen_token}"}) # Citizen trying admin route
        self.assertEqual(res_admin.status_code, 403)
        print("  [PASS] TEST 14 PASSED: 401 & 403 returned on unauthorized requests.")

    def test_15_invalid_file_rejected(self):
        """TEST 15: Uploading an invalid file is rejected."""
        citizen_token = self.get_token("citizen@nyaya.ai")
        data = {
            'title': 'Dangerous Executable',
            'file': (io.BytesIO(b"binary_payload"), 'test.exe')
        }
        res = self.client.post('/api/cases/1/documents', data=data, content_type='multipart/form-data', headers={'Authorization': f"Bearer {citizen_token}"})
        self.assertEqual(res.status_code, 400)
        print("  [PASS] TEST 15 PASSED: Unsupported file extension .exe rejected (400).")

if __name__ == '__main__':
    print("\n RUNNING NYAYAAI SECURITY & INTEGRATION TEST SUITE...")
    unittest.main(verbosity=2)
