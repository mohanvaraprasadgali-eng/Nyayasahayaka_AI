from datetime import datetime

TEMPLATES_METADATA = [
    {
        "id": "salary_notice",
        "title": "Legal Demand Notice for Unpaid Salary",
        "category": "Employment / Labour",
        "description": "Formal statutory demand notice served to an employer demanding payment of unpaid salary arrears plus interest within 15 days.",
        "fields": [
            {"name": "complainant_name", "label": "Your Full Name (Employee)", "type": "text", "required": True, "placeholder": "e.g. Ramesh Kumar"},
            {"name": "complainant_address", "label": "Your Complete Postal Address", "type": "text", "required": True, "placeholder": "e.g. H.No 4-12, Madhapur, Hyderabad - 500081"},
            {"name": "employer_name", "label": "Employer / Company Name", "type": "text", "required": True, "placeholder": "e.g. TechCorp Solutions Pvt. Ltd."},
            {"name": "employer_address", "label": "Company Registered Address", "type": "text", "required": True, "placeholder": "e.g. Cyber Towers, HITEC City, Hyderabad"},
            {"name": "designation", "label": "Your Designation", "type": "text", "required": True, "placeholder": "e.g. Senior Software Engineer"},
            {"name": "unpaid_months", "label": "Months for which Salary is Unpaid", "type": "text", "required": True, "placeholder": "e.g. May 2026, June 2026, and July 2026"},
            {"name": "monthly_salary", "label": "Monthly Net Salary (INR)", "type": "text", "required": True, "placeholder": "e.g. Rs. 45,000/-"},
            {"name": "total_amount", "label": "Total Unpaid Arrears (INR)", "type": "text", "required": True, "placeholder": "e.g. Rs. 1,35,000/-"}
        ]
    },
    {
        "id": "rental_deposit_notice",
        "title": "Legal Notice for Refund of Rental Security Deposit",
        "category": "Housing & Tenancy",
        "description": "Formal demand notice calling upon landlord to refund security deposit after peaceful vacation of leased premises.",
        "fields": [
            {"name": "tenant_name", "label": "Your Name (Tenant)", "type": "text", "required": True, "placeholder": "e.g. Priya Sharma"},
            {"name": "tenant_address", "label": "Your Current Address", "type": "text", "required": True, "placeholder": "e.g. Flat 302, Green Meadows, Bengaluru"},
            {"name": "landlord_name", "label": "Landlord / Owner Name", "type": "text", "required": True, "placeholder": "e.g. Mr. K. Satyanarayana"},
            {"name": "landlord_address", "label": "Landlord Postal Address", "type": "text", "required": True, "placeholder": "e.g. Plot 45, Jubilee Hills, Hyderabad"},
            {"name": "property_address", "label": "Rented Premises Address", "type": "text", "required": True, "placeholder": "e.g. Flat 101, Sai Residency, Banjara Hills"},
            {"name": "deposit_amount", "label": "Security Deposit Amount (INR)", "type": "text", "required": True, "placeholder": "e.g. Rs. 60,000/-"},
            {"name": "vacation_date", "label": "Date of Premises Handover", "type": "text", "required": True, "placeholder": "e.g. 31st July 2026"}
        ]
    },
    {
        "id": "consumer_notice",
        "title": "Consumer Grievance Legal Notice",
        "category": "Consumer Protection",
        "description": "Statutory pre-litigation notice to manufacturer or seller for defective goods or deficiency of service under Consumer Protection Act 2019.",
        "fields": [
            {"name": "consumer_name", "label": "Consumer Full Name", "type": "text", "required": True, "placeholder": "e.g. Arvind Mehta"},
            {"name": "consumer_address", "label": "Consumer Address", "type": "text", "required": True, "placeholder": "e.g. 12/B, MG Road, Pune"},
            {"name": "company_name", "label": "Company / Seller Name", "type": "text", "required": True, "placeholder": "e.g. Apex Electronics Retail Pvt. Ltd."},
            {"name": "company_address", "label": "Seller Registered Office Address", "type": "text", "required": True, "placeholder": "e.g. Industrial Area Phase 2, Mumbai"},
            {"name": "product_name", "label": "Product / Service Purchased", "type": "text", "required": True, "placeholder": "e.g. Smart LED Television 55-inch"},
            {"name": "invoice_number", "label": "Invoice / Bill Number & Date", "type": "text", "required": True, "placeholder": "e.g. INV-98421 dated 10 April 2026"},
            {"name": "purchase_price", "label": "Purchase Price Paid (INR)", "type": "text", "required": True, "placeholder": "e.g. Rs. 42,999/-"},
            {"name": "defect_description", "label": "Description of Defect / Grievance", "type": "textarea", "required": True, "placeholder": "Display screen stopped working within 2 months of purchase; service center refused free replacement despite active warranty."}
        ]
    },
    {
        "id": "police_sp_representation",
        "title": "Representation to Superintendent of Police (FIR Refusal)",
        "category": "Criminal Justice & Civil Rights",
        "description": "Formal written petition to District SP / Commissioner under Section 173(3) BNSS / Sec 154(3) CrPC following station refusal.",
        "fields": [
            {"name": "complainant_name", "label": "Complainant Name", "type": "text", "required": True, "placeholder": "e.g. S. Venkatesh"},
            {"name": "complainant_address", "label": "Complainant Address & Contact", "type": "text", "required": True, "placeholder": "e.g. H.No 8-2-120, Gachibowli, Hyderabad | +91 9876543210"},
            {"name": "police_station_name", "label": "Police Station that Refused FIR", "type": "text", "required": True, "placeholder": "e.g. Gachibowli Police Station, Cyberabad Commissionerate"},
            {"name": "visit_date", "label": "Date & Time of Station Visit", "type": "text", "required": True, "placeholder": "e.g. 18th August 2026 at 4:30 PM"},
            {"name": "accused_details", "label": "Name & Details of Accused Persons", "type": "text", "required": True, "placeholder": "e.g. Rahul Gupta and 2 unknown associates"},
            {"name": "incident_facts", "label": "Brief Facts of Cognizable Offence", "type": "textarea", "required": True, "placeholder": "Criminal intimidation, physical extortion, and threat to life committed on 16th August 2026."}
        ]
    },
    {
        "id": "rti_application",
        "title": "Right to Information (RTI) Application",
        "category": "Governance & RTI",
        "description": "Standard citizen application under Section 6(1) of RTI Act 2005 seeking certified documents or inspection of records.",
        "fields": [
            {"name": "applicant_name", "label": "Applicant Full Name", "type": "text", "required": True, "placeholder": "e.g. Rajeshwar Rao"},
            {"name": "applicant_address", "label": "Mailing Address & Phone", "type": "text", "required": True, "placeholder": "e.g. Plot 77, Anand Nagar, Warangal - 506002"},
            {"name": "public_authority", "label": "Public Authority / Department Name", "type": "text", "required": True, "placeholder": "e.g. Greater Hyderabad Municipal Corporation (GHMC)"},
            {"name": "pio_address", "label": "PIO Office Address", "type": "text", "required": True, "placeholder": "e.g. Head Office, Tank Bund Road, Hyderabad"},
            {"name": "information_points", "label": "Specific Information / Certified Copies Sought", "type": "textarea", "required": True, "placeholder": "1. Certified copy of building sanction plan for plot 44.\n2. Daily progress report and file notings regarding road repair tender #TR-889."}
        ]
    }
]


def generate_document_text(template_id, data):
    """
    Generates structured, professional legal draft based on template type and field parameters.
    """
    today_str = datetime.now().strftime("%d %B %Y")
    
    if template_id == "salary_notice":
        return f"""LEGAL DEMAND NOTICE
(UNDER PAYMENT OF WAGES ACT, 1936 / CODE ON WAGES, 2019 & SECTION 33C(2) INDUSTRIAL DISPUTES ACT)

DATE: {today_str}
DISPATCH MODE: REGISTERED POST WITH ACKNOWLEDGEMENT DUE (RPAD) / SPEED POST / OFFICIAL EMAIL

TO,
The Managing Director / Head of Human Resources,
{data.get('employer_name', '[Company Name]')},
{data.get('employer_address', '[Company Address]')}.

FROM:
{data.get('complainant_name', '[Employee Name]')},
Former / Current Designation: {data.get('designation', '[Designation]')},
Resident of: {data.get('complainant_address', '[Employee Address]')}.

SUBJECT: FORMAL STATUTORY DEMAND NOTICE FOR IMMEDIATE DISBURSEMENT OF OUTSTANDING SALARY ARREARS TOTALING {data.get('total_amount', 'Rs. [Amount]')}/- ALONG WITH ACCRUED INTEREST.

Sir / Madam,

Under instructions and on behalf of my client / the undersigned ({data.get('complainant_name')}), this formal Legal Notice is hereby served upon you:

1. That the undersigned was duly appointed by your organization ({data.get('employer_name')}) as "{data.get('designation')}" with an agreed net monthly remuneration of {data.get('monthly_salary')}/-.

2. That the undersigned diligently, faithfully, and satisfactorily discharged all assigned professional duties, tasks, and obligations during the tenure of employment, adhering strictly to company policies.

3. That despite regular performance of duties and multiple written reminders, your organization has unlawfully failed, neglected, and withheld the payment of monthly salary for the period: {data.get('unpaid_months')}.

4. That the total outstanding and unpaid wage arrears lawfully due and payable by you to the undersigned stands at {data.get('total_amount')}/- (Rupees only).

5. That your withholding of earned wages without lawful justification constitutes a direct violation of Section 5 and Section 15 of the Payment of Wages Act, 1936, the Code on Wages 2019, and amounts to criminal breach of trust under the Bharatiya Nyaya Sanhita (BNS) / IPC.

THEREFORE, YOU ARE HEREBY CALLED UPON to release and credit the complete outstanding sum of {data.get('total_amount')}/- along with interest @ 18% per annum into the bank account of the undersigned within FIFTEEN (15) DAYS from the date of receipt of this notice.

PLEASE TAKE NOTE that in the event of your failure or refusal to comply within the stipulated 15 days, the undersigned shall be constrained to initiate appropriate legal proceedings before the Hon'ble Authority under the Payment of Wages Act / Labour Court / Civil Court, as well as file criminal complaints for financial fraud and misappropriation, entirely at your risk, costs, and consequences.

Yours sincerely,

_________________________
{data.get('complainant_name')}
(Employee / Complainant)
Address: {data.get('complainant_address')}
"""

    elif template_id == "rental_deposit_notice":
        return f"""LEGAL DEMAND NOTICE
(UNDER SECTION 108 TRANSFER OF PROPERTY ACT, 1882 & MODEL TENANCY ACT, 2021)

DATE: {today_str}
DISPATCH MODE: SPEED POST AD / REGISTERED POST / REGISTERED EMAIL

TO,
{data.get('landlord_name', '[Landlord Name]')},
{data.get('landlord_address', '[Landlord Address]')}.

FROM:
{data.get('tenant_name', '[Tenant Name]')},
Current Address: {data.get('tenant_address', '[Tenant Current Address]')}.

SUBJECT: LEGAL NOTICE FOR REFUND OF REFUNDABLE SECURITY DEPOSIT OF {data.get('deposit_amount', 'Rs. [Amount]')}/- IN RESPECT OF PREMISES LOCATED AT {data.get('property_address', '[Property Address]')}.

Sir / Madam,

This formal Legal Notice is served upon you as follows:

1. That the undersigned ({data.get('tenant_name')}) occupied your residential/commercial premises situated at {data.get('property_address')} as a bona fide tenant pursuant to the Tenancy Agreement.

2. That at the inception of the tenancy, the undersigned deposited an interest-free refundable security deposit sum of {data.get('deposit_amount')}/- with you, which was strictly refundable upon vacation of the premises.

3. That the undersigned duly served advance notice of vacation, cleared all pending electricity, water, and maintenance dues, and peacefully handed over vacant and physical possession of the said premises to you on {data.get('vacation_date')}.

4. That at the time of handover, the premises were inspected and found in clean, undamaged, and tenantable condition (as documented in time-stamped inspection media).

5. That despite peaceful handover and repeated verbal and written requests, you have unlawfully, arbitrarily, and illegally withheld the entire security deposit of {data.get('deposit_amount')}/-, which amounts to unjust enrichment and civil fraud.

THEREFORE, YOU ARE HEREBY CALLED UPON to immediately transfer and refund the full security deposit of {data.get('deposit_amount')}/- to the bank account of the undersigned within FOURTEEN (14) DAYS from the receipt of this notice.

Failure to do so will leave the undersigned with no option but to institute legal proceedings before the Rent Tribunal / District Consumer Commission / Civil Court for recovery of the deposit along with 18% p.a. interest, damages for mental agony, and legal litigation costs.

Yours faithfully,

_________________________
{data.get('tenant_name')}
Address: {data.get('tenant_address')}
"""

    elif template_id == "consumer_notice":
        return f"""FORMAL CONSUMER DISPUTE & LEGAL NOTICE
(UNDER CONSUMER PROTECTION ACT, 2019)

DATE: {today_str}
MODE OF SERVICE: REGISTERED POST WITH A.D. / SPEED POST / FORMAL EMAIL

TO,
{data.get('company_name', '[Company / Seller Name]')},
{data.get('company_address', '[Company Registered Office]')}.

FROM:
{data.get('consumer_name', '[Consumer Name]')},
{data.get('consumer_address', '[Consumer Address]')}.

SUBJECT: FORMAL NOTICE FOR REPLACEMENT / FULL REFUND OF {data.get('purchase_price', 'Rs. [Price]')}/- AND COMPENSATION FOR DEFICIENCY OF SERVICE AND UNFAIR TRADE PRACTICE.

Sir / Madam,

1. That the undersigned ({data.get('consumer_name')}) is a bona fide consumer who purchased/availed: "{data.get('product_name')}" from you vide Invoice No: {data.get('invoice_number')} against total valuable consideration of {data.get('purchase_price')}/-.

2. That the aforesaid product/service was warranted to be free from manufacturing defects and backed by express warranty commitments.

3. That shortly following purchase, the following severe defects and deficiencies manifested:
   "{data.get('defect_description')}"

4. That despite repeated visits to your authorized service center and formal email grievances, you have failed, neglected, and refused to rectify the defect or provide replacement under warranty terms, constituting gross deficiency of service and unfair trade practice under Section 2(11) and 2(47) of the Consumer Protection Act, 2019.

NOW THEREFORE, YOU ARE HEREBY PUT ON NOTICE to:
a) Provide immediate full refund of {data.get('purchase_price')}/- OR replace the product with a brand new unit within 15 DAYS of receipt of this notice; and
b) Pay a sum of Rs. 15,000/- towards compensation for mental agony and harassment.

In default, a formal Consumer Complaint will be instituted before the District Consumer Disputes Redressal Commission (DCDRC) via e-Daakhil for full refund, punitive damages under Product Liability, and litigation costs.

Yours faithfully,

_________________________
{data.get('consumer_name')}
Address: {data.get('consumer_address')}
"""

    elif template_id == "police_sp_representation":
        return f"""WRITTEN REPRESENTATION TO SUPERINTENDENT OF POLICE
(UNDER SECTION 173(3) OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 / SECTION 154(3) CrPC)

DATE: {today_str}
DISPATCH MODE: SPEED POST AD / IN-PERSON DIARY ACKNOWLEDGEMENT

TO,
The Superintendent of Police / Commissioner of Police,
District / Police Commissionerate Office.

FROM:
{data.get('complainant_name', '[Complainant Name]')},
{data.get('complainant_address', '[Complainant Address & Phone]')}.

SUBJECT: WRITTEN SUBMISSION REGARDING COMMISSION OF COGNIZABLE OFFENCES AND REFUSAL BY STATION HOUSE OFFICER ({data.get('police_station_name')}) TO REGISTER FIRST INFORMATION REPORT (FIR).

Respected Sir / Madam,

1. That the applicant/complainant is a law-abiding citizen residing at the address stated above.

2. That on {data.get('visit_date')}, the applicant approached the Station House Officer (SHO), {data.get('police_station_name')}, with a formal written complaint regarding serious cognizable offences committed by the accused persons: {data.get('accused_details')}.

3. That the brief facts disclosing the cognizable offence are as under:
   "{data.get('incident_facts')}"

4. That despite the complaint clearly establishing the commission of cognizable offences, the SHO/Duty Officer of {data.get('police_station_name')} unlawfully refused to register an FIR and failed to provide any acknowledgment, in direct contravention of the mandatory directions of the Hon'ble Supreme Court of India in Lalita Kumari vs. Govt. of U.P. [(2014) 2 SCC 1].

5. PRAYER:
   In view of the statutory mandate under Section 173(3) of BNSS 2023 / Section 154(3) of CrPC, it is most respectfully prayed that your good office may be pleased to:
   a) Direct the registration of an FIR against the accused persons at {data.get('police_station_name')};
   b) Order an impartial investigation by a competent police officer; and
   c) Ensure protection of the life and liberty of the applicant and witnesses.

Enclosures:
1. Copy of original written complaint presented at Police Station.
2. Corroborative evidence / screenshots / medical report (if any).
3. Complainant Photo Identity Proof.

Yours faithfully,

_________________________
{data.get('complainant_name')}
Contact: {data.get('complainant_address')}
"""

    elif template_id == "rti_application":
        return f"""APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

DATE: {today_str}

TO,
The Public Information Officer (PIO) / Assistant Public Information Officer (APIO),
{data.get('public_authority', '[Public Authority / Ministry / Department]')},
{data.get('pio_address', '[PIO Office Address]')}.

FROM:
Applicant Name: {data.get('applicant_name', '[Applicant Name]')},
Citizenship: Citizen of India,
Postal Address: {data.get('applicant_address', '[Applicant Postal Address]')}.

SUBJECT: APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005.

Sir / Madam,

Please provide certified true copies / information with respect to the following specific points:

{data.get('information_points', '1. [Specify information item 1]\n2. [Specify information item 2]')}

APPLICATION FEE DETAILS:
- Statutory application fee of Rs. 10/- has been enclosed via Indian Postal Order (IPO) / Court Fee Stamp / Online Payment Transaction Receipt No: ______________ dated _________.
(Note: If applicant belongs to Below Poverty Line (BPL) category, copy of valid BPL card is enclosed for fee waiver under Sec 7(5)).

PERIOD TO WHICH INFORMATION RELATES: Recent / Relevant Fiscal Years.

PREFERRED MODE OF RECEIPT: By Registered / Speed Post to the address mentioned above.

DECLARATION:
I hereby declare that I am a Citizen of India and the information sought is within the purview of the Right to Information Act, 2005 and is not exempted under Section 8 or 9.

Yours faithfully,

_________________________
{data.get('applicant_name')}
Address: {data.get('applicant_address')}
"""

    return f"""LEGAL NOTICE / FORMAL COMMUNICATION
DATE: {today_str}

TO,
{data.get('recipient_name', '[Recipient Name]')},
{data.get('recipient_address', '[Recipient Address]')}.

FROM:
{data.get('sender_name', '[Sender Name]')},
{data.get('sender_address', '[Sender Address]')}.

SUBJECT: FORMAL LEGAL NOTICE

Sir / Madam,

This formal communication is served upon you regarding the following matter:
{data.get('matter_description', '[Matter Details]')}

Please take notice and resolve the aforementioned matter within 15 days of receipt of this notice.

Yours faithfully,
{data.get('sender_name', '[Sender Name]')}
"""
