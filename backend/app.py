import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database.db import init_db
from database.seed_data import seed_database
from services.document_security import DocumentSecurityService

# Import Existing & New Blueprints
from routes.auth import auth_bp
from routes.lawyers import lawyers_bp
from routes.secure_documents import secure_docs_bp
from routes.chat import chat_bp
from routes.payments import payments_bp
from routes.subscriptions import subscriptions_bp
from routes.notifications import notifications_bp
from routes.admin import admin_bp

from routes.analysis import analysis_bp
from routes.documents import documents_bp
from routes.cases import cases_bp
from routes.evidence import evidence_bp
from routes.actions import actions_bp
from routes.authorities import authorities_bp
from routes.reminders import reminders_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize secure storage folder
    DocumentSecurityService.init_storage()
    
    # Enable CORS for frontend development
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register all blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(lawyers_bp)
    app.register_blueprint(secure_docs_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(subscriptions_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(admin_bp)

    app.register_blueprint(analysis_bp)
    app.register_blueprint(documents_bp)
    app.register_blueprint(cases_bp)
    app.register_blueprint(evidence_bp)
    app.register_blueprint(actions_bp)
    app.register_blueprint(authorities_bp)
    app.register_blueprint(reminders_bp)
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "NyayaAI — Secure AI Legal Rights & Lawyer Assistance Platform API",
            "version": "2.0.0 (SIH 2026 Platform)",
            "roles_supported": ["citizen", "lawyer", "admin"],
            "security_mode": "Active (Encrypted Vault & Strict Role/Case-Level Access Control)",
            "ai_mode": "Active (Indian Legal Intelligence Engine & Verification Pipeline)"
        }), 200
        
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "API route not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"success": False, "error": "Internal server error"}), 500

    return app

# Initialize DB on start
init_db()
seed_database()

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"[API] Starting NyayaAI Flask API Server on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
