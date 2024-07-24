import time

import requests

from api.config import settings
from api.endpoints.v1.utils import parse_rfc3339


def call_anthropic_api(batches, headers=None):
    headers = headers or {
        "x-api-key": settings.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    url = "https://api.anthropic.com/v1/messages"
    previous_summary = ""
    responses = []

    if len(batches) > 30:
        return "Batch size exceeds 30."

    for i, batch in enumerate(batches):
        user_message = (
            f"Previous summary: {previous_summary} New information: {batch}"
            if previous_summary
            else batch
        )

        data = {
            "model": "claude-3-haiku-20240307",
            "max_tokens": 4096,
            "temperature": 0,
            "system": prompt,
            "messages": [{"role": "user", "content": user_message}],
        }

        response = requests.post(url, headers=headers, json=data)

        if response.ok:
            response_data = response.json()
            previous_summary = response_data["content"][0]["text"]
            responses.append(response_data)
            print(f"Message{i}: {previous_summary}")

            if i < len(batches) - 1:
                reset_time = parse_rfc3339(
                    response.headers.get("anthropic-ratelimit-tokens-reset")
                )
                sleep_time = reset_time - time.time() if reset_time else 60
                if sleep_time > 0:
                    time.sleep(sleep_time)

        else:
            print(
                f"API call failed with status {response.status_code}: {response.text}"
            )
            return f"API call failed for batch {i+1}."

    return previous_summary


# Feed each batch iteratively into the LLM model
template = """
Header
Patient Identifier: [Name, DOB, MRN]
Date of Report: [Date]
Prepared for: [Provider Name, Specialty]

1. Chief Complaints
Reasons for Upcoming and Recent Encounters: [Brief summary]

2. Recent Encounters and Interventions
Date: [Date]
Provider: [Name, Specialty]
Summary: [Reason for visit, key findings, interventions, outcomes]
Follow-Up Needs: [Monitoring or additional care required]

3. Medications
Current Medications: [Drug name, dosage, frequency, purpose]
Medication Changes: [Newly added or discontinued, reasons]
Compliance and Issues: [Non-adherence flags, side effects]

4. Allergies
Substance: [Allergen]
Reaction: [Clinical reaction]
Severity: [Mild/Moderate/Severe]

5. Labs and Imaging Summary
Recent Findings: [Abnormal results and trends]
Pending Results: [Tests with results pending]
Interpretations: [Provider interpretations where applicable]

6. Vitals Trends
Recent Readings: [Trends and abnormal values]

7. Functional and Cognitive Status
ADLs and IADLs: [Independence level, assistance required]
Mobility and Fall Risk: [Mobility aids used, fall risk assessment]
Cognitive Function: [Screening results, cognitive impairments]
Behavioral and Psychological Symptoms: [Mood disorders, behavioral issues]
Nutritional Status: [Assessment, weight monitoring]
Sensory Impairments: [Hearing, vision, communication needs]
Social Support System: [Caregiver support, social engagement]

8. Medical History Summary
Chronic Conditions: [List with onset start and end dates and current status]
Past Hospitalizations/Surgeries: [Dates, reasons, outcomes]
Significant Past Interventions: [Medications, therapies, outcomes]
Family History: [Relevant genetic or familial diseases]
Social History: [Smoking, alcohol use, drug use, living situation]

9. Assessment and Plan
Assessment: [Consolidated view from recent encounters]
Plan: [Management plans, pending tests/procedures]

10. Advanced Directives
Type: [DNR, living will, healthcare proxy]
Specifications: [Detailed directives]

11. Insurance/Financial Considerations
Coverage Details: [Insurance type, limitations]
Financial Concerns: [Concerns affecting care choices]

12. Referrals and Correspondence
Referral Date: [Date]
From: [Provider Name, Specialty, Institution]
Reason for Referral/Correspondence: [Concise summary]
Key Information Provided: [Summary of relevant patient history, diagnostic findings, treatments tried, and questions or goals from the referring provider]
Recommendations and Requests: [Specific recommendations or diagnostic/treatment requests from the referring provider]

Footer
Prepared By: WellChart, Version
Confidentiality Notice: [Standard disclaimer]
"""

prompt = f"""
Context: Using only the detailed text resource information from an EMR provided without hallucinating and leaving fields blank if you don't have the required information, generate a precharting report that adheres to the following structured format, including all relevant medical and clinical information under each heading and subheading as detailed below:
{template}
Ensure the generated precharting report is organized, concise, and clearly separates each section and subheading as outlined. Make it as clear and concise as possible without losing relevant information and list start and end dates whenever you have that information. When listing things alphabetically, list a first and z last. When listing things by date, include the start date and end date where applicable to create a timeline, and list the most recent event first. The report should accurately reflect the patient's condition, plan of care, and timeline based only on the current date and information provided.
You may not be given all of the patient's information at once, so update the unfinished report as you get more information.
Generate the precharting report based on the structured format and detailed instructions provided above.
"""
