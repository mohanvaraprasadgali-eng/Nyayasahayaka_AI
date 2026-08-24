from database.db import get_db_connection

CATEGORY_SPECIALIZATION_MAP = {
    "Rental / Housing": ["Civil & Property", "Real Estate & Tenancy", "General Civil"],
    "Employment & Labour": ["Labour & Employment", "Corporate & Service Law", "General Civil"],
    "Consumer Rights": ["Consumer Law", "Civil & Commercial", "General Civil"],
    "Cybercrime & Financial Fraud": ["Cyber Law", "Criminal & Financial Defense", "IT Law"],
    "Police & Criminal Procedure": ["Criminal Law", "Constitutional & Human Rights", "BNSS / CrPC"],
    "General": ["General Civil", "Civil & Property", "Consumer Law"]
}

class MatchingService:
    @classmethod
    def find_matching_lawyers_for_case(cls, case_data: dict, limit: int = 5) -> list:
        """
        Finds verified lawyers with active subscriptions matching the case category and location.
        """
        category = case_data.get('category', 'General')
        location = case_data.get('location', '')

        relevant_specs = CATEGORY_SPECIALIZATION_MAP.get(category, ["General Civil", "Consumer Law", "Civil & Property"])

        conn = get_db_connection()
        cursor = conn.cursor()

        # Query verified lawyers with active subscriptions
        cursor.execute("""
            SELECT 
                lp.id as lawyer_id,
                lp.user_id,
                u.name,
                u.email,
                u.phone,
                u.city,
                u.state,
                lp.bar_council_number,
                lp.state_bar_council,
                lp.specialization,
                lp.experience_years,
                lp.languages_known,
                lp.bio,
                lp.rating,
                lp.total_cases_handled,
                ls.plan_name as subscription_plan,
                ls.status as subscription_status,
                ls.end_date as subscription_expiry
            FROM lawyer_profiles lp
            JOIN users u ON lp.user_id = u.id
            LEFT JOIN lawyer_subscriptions ls ON lp.id = ls.lawyer_id
            WHERE lp.verification_status = 'VERIFIED'
              AND (ls.status IN ('ACTIVE', 'EXPIRING_SOON') OR ls.id IS NULL)
            ORDER BY lp.rating DESC, lp.experience_years DESC
        """)
        
        all_lawyers = [dict(r) for r in cursor.fetchall()]
        conn.close()

        # Score and rank lawyers
        scored = []
        for l in all_lawyers:
            score = 0
            # Specialization check
            if any(spec.lower() in l['specialization'].lower() for spec in relevant_specs):
                score += 50
            if category.lower() in l['specialization'].lower():
                score += 30
            # Location check
            if location and (l['city'].lower() in location.lower() or l['state'].lower() in location.lower()):
                score += 20
            # Rating & experience boost
            score += min(int(l['rating'] * 5), 25)
            score += min(l['experience_years'] * 2, 20)

            scored.append((score, l))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:limit]]
