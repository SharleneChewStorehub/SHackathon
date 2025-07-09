# Product Requirements Document: Dynamic Growth Dashboard

- **Project Codename:** "Today's Opportunities"
- **Document Version:** 1.5
- **Date:** July 9, 2025
- **Status:** FINAL

---

### **Document Revision History**
* **v1.0:** Initial draft.
* **v1.1:** Added "Growth History" page to Hackathon scope.
* **v1.2:** Incorporated CTO feedback: Refined AI/ML roadmap to a heuristics-first approach, added the data pipeline as a formal dependency, and specified a phased microservice rollout.
* **v1.3:** Added "Development Workflow & Tooling Guidelines" section to specify the role of Cursor in version control, guidance, and progress logging.
* **v1.4:** Updated to reflect actual implementation: Changed persona from Priya to Alia (Mama Kopitiam), confirmed vanilla JavaScript approach, and added StoreHub branding requirements.
* **v1.5:** Major refinement of the user workflow based on brainstorming. Overhauled FR-3 to specify a dual-option CSV download ("Actionable List" & "Insight Summary") and FR-6 to redefine "Growth History" as a "CEO Report Card" showing "Potential vs. Actual" results.

---

### **1. Introduction & Overview**

This document outlines the requirements for the **Dynamic Growth Dashboard**, a new core component of the merchant Backoffice. The project's purpose is to transform the current static dashboard into a proactive, AI-powered growth consultant. By analyzing a merchant's own data, the system will surface specific, actionable, and high-impact "Opportunities" to drive revenue growth, improve profitability, and increase customer retention.

This initiative directly addresses the low adoption and high churn of the "Engage" SMS marketing add-on by shifting from a tool that requires user analysis to a partner that provides ready-to-execute solutions, proving its own ROI with every interaction.

---

### **2. Problem Statement**

Our merchants, whether in F&B or Retail, are time-poor and data-rich. They possess a wealth of information in their Backoffice but lack the time and analytical expertise to translate this data into profitable actions. The current suite of reports is passive, placing the burden of analysis entirely on the user.

Consequently, value-add features like the "Engage" add-on are perceived as having an unclear ROI. Merchants attempt generic campaigns, see mediocre results, and quickly churn, failing to unlock the tool's true potential. We are not facing a data availability problem; we are facing an **insight delivery and actionability crisis.**

---

### **3. Goals & Objectives (SMART)**

* **Merchant-Facing Goal:** To empower merchants to make their next most profitable decision in under 60 seconds, increasing their confidence and giving them a tangible sense of control over their business growth.
* **Business Objective 1 (Adoption):** Increase the adoption rate of the "Engage" add-on by 25% within 6 months of launch by proving its value prior to subscription.
* **Business Objective 2 (Retention):** Reduce churn of "Engage" subscribers by 40% within 6 months of launch by continuously demonstrating clear, attributable ROI.
* **Business Objective 3 (Engagement):** Increase the number of marketing campaigns launched per active merchant by 50% within 3 months, indicating a successful shift from passive reporting to active engagement.

---

### **4. Target Audience & Personas**

* **Primary Persona: "The Busy Owner" (Alia, Mama Kopitiam Owner)**
    * **Business:** Mama Kopitiam, a Malaysian F&B establishment in Bangsar, Kuala Lumpur
    * **Needs:** Fast, effective solutions that directly impact her bottom line. She doesn't have time to become a data analyst.
    * **Pain Points:** Worries about "at-risk" customers but doesn't know who they are. Knows some menu items are more profitable but isn't sure how to promote them effectively. Finds the current reports overwhelming.
    * **"How We Win":** We give Alia 1-3 concrete, data-backed suggestions like "Boost sales of your high-margin 'Karipap Pusing' with a combo deal" and a one-click way to launch the campaign.

---

### **5. User Stories / Use Cases**

* As a Busy Owner, I want to see pre-analyzed, prioritized growth opportunities when I log in, so that I immediately know what action will have the biggest impact on my business.
* As a Skeptical Owner, I want to see the data and reasoning behind a suggestion, so that I can trust that the AI's recommendation is valid and not a generic gimmick.
* **As a Time-Poor Owner, I want to download a summary of an opportunity, so I can review it later or share it with my business partner.**
* **As a Hands-On Owner, I want to download the raw data behind a suggestion, so I can perform my own analysis or use it for a manual marketing campaign.**
* As a Growth-Focused Owner, I want to launch a targeted marketing campaign based on a specific insight with one click, so that I can close the gap between analysis and action instantly.
* As a Results-Driven Owner, I want to easily track the performance and ROI of campaigns launched from these opportunities, so that I can confirm the feature is providing tangible value.
* As an Organized Owner, I want to view a history of past opportunities and the actions I took, so that I can review my growth strategy over time.

---

### **6. Functional Requirements**

#### **FR-1: The "Today's Opportunities" Widget**
* **FR-1.1:** The main dashboard shall feature a new widget titled "Today's Opportunities."
* **FR-1.2:** The widget shall display up to three prioritized "Opportunity Cards."
* **FR-1.3:** Each card shall contain: a Category Tag, a Headline, a one-line Summary, an estimated Impact (e.g., potential revenue), a `[Launch Campaign]` button, and a `[See the Analysis]` button.
* **FR-1.4:** The widget shall include an information icon ("i") that explains where past opportunities are stored and links to the "Growth History" page.

#### **FR-2: The "AI Brain" Analysis (Production)**
* **FR-2.1:** A backend analytical service shall run continuous analyses on merchant data from Amazon Redshift.
* **FR-2.2 (Heuristics-First Approach):** For the initial production release (Phase 2), the "AI Brain" will be built as a **sophisticated rule-based heuristics engine.** It will identify opportunities by applying logical, explainable rules to merchant data (e.g., `IF item_margin > 40% AND item_sales_volume < 10th_percentile THEN trigger 'Profit Opportunity'`).
* **FR-2.3:** The analyses must cover a breadth of business pillars, including Customer Lifecycle, Product Profitability, Basket Analysis, and Inventory Aging.
* **FR-2.4 (Hackathon Simulation):** A `mockData.js` file will contain an array of pre-defined opportunity objects that simulate the output of this engine.

#### **FR-3: The "Prove It" Justification Modal**
* **FR-3.1:** Clicking `[See the Analysis]` shall open a pop-up modal.
* **FR-3.2:** The modal must serve as a "Justification Dashboard," providing a compelling business case for the opportunity.
* **FR-3.3:** The modal shall contain a short narrative summary explaining the insight and one or more relevant data visualizations (e.g., a 2x2 matrix, a comparative bar chart, a trend line).
* **FR-3.4 (REVISED): The "Downloadable Growth Kit"**
    * **FR-3.4.1:** The modal must contain a `[Download CSV]` button that, upon clicking, reveals a dropdown menu with two distinct options.
        * **Rationale:** This caters to different merchant workflows. Some merchants want to act immediately (`Launch Campaign`), some want raw data to analyze (`Actionable List`), and others want a summary to review or share (`Insight Summary`). Providing these options makes the feature valuable for all user types.
    * **FR-3.4.2: Option 1 - `Download Actionable List`**
        * **Purpose:** To provide the merchant with ready-to-use, data-rich raw data for immediate, flexible action. This is for the "Hands-On Owner."
        * **Example 1 ("Win Back At-Risk VIPs"):** A list of the specific customers, including `Customer Name`, `Phone Number`, `Last Visit Date`, `Lifetime Spend`, and `Favorite Item` for personalization.
        * **Example 2 ("Boost Most Profitable Item"):** A "Profit Booster's Playbook" with two worksheets: one showing a profit deep-dive on the target item, and a second comparing the top 5 most and least profitable items to inspire combo deals.
        * **Example 3 ("Increase Average Order Value"):** A "Perfect Combo Builder" analyzing what Nasi Lemak buyers most frequently add to their order, including the profit margin of those potential add-on items.
    * **FR-3.4.3: Option 2 - `Download Insight Summary`**
        * **Purpose:** To provide a portable, shareable "business case" that packages the on-screen analysis into a clean, offline file. This serves multiple needs: allowing a "Busy Owner" to review it later, enabling delegation to a team member, and creating a "Before Snapshot" for record-keeping.
        * **Structure:** A multi-worksheet CSV file.
        * **Worksheet 1: "Opportunity Briefing":** A well-formatted snapshot of all the information from the modal, including the narrative, supporting data cards (`Current Sales Volume`, `Profit Margin`, etc.), and expected impact.
        * **Worksheet 2: "Promotion Planner":** A simple, pre-formatted template to help the merchant plan their campaign *before* launching. It includes fields for `Promotion Idea`, `Offer Details`, `Target Audience`, and a simple profit calculator (`Standard Price`, `Proposed Discount`, `New Profit Per Unit`).

#### **FR-4: The Insight-to-Action Workflow**
* **FR-4.1:** Clicking `[Launch Campaign]` shall intelligently route the user to the correct campaign creation page within the "Engage" module.
* **FR-4.2:** **AI-Powered Smart Segments:** For automated campaigns (e.g., "Win Back At-Risk VIPs"), the system shall not generate a one-time static list. It will create a dynamic, rule-based definition (e.g., `Lifetime Spend > X AND Last Visit > Y days`). This "Smart Segment" will automatically enroll or remove customers based on daily checks, creating a true "set-and-forget" automation. The campaign setup page will show the "AI-Powered Smart Segment" as the selected audience.
* **FR-4.3:** For tactical promotions (e.g., "Boost Profit on Item X"), the system will open a One-Time Custom Campaign with pre-filled details (suggested SMS copy, offer details).

#### **FR-5: The Feedback Loop**
* **FR-5.1:** Upon clicking `[Launch Campaign]`, the card on the dashboard shall immediately enter a "grayed out" state.
* **FR-5.2:** The card's text shall change to "✅ Campaign Launched! `[View Performance]`". The link will direct the user to the relevant Campaign Insights page.
* **FR-5.3:** After a set period (e.g., 24 hours), the card shall be removed from the dashboard and moved to the "Growth History" page.

#### **FR-6: The "Growth History" Page (REVISED)**
* **FR-6.1:** A new page titled "Growth History" shall be created, accessible from the main "Reports" section of the Backoffice and the "i" icon on the dashboard widget.
* **FR-6.2 (REVISED): The "CEO's Report Card" Vision**
    * **Purpose:** The Growth History page will not be a simple log. It will serve as a high-level "Strategic Journal" or "Report Card," allowing a merchant to see the results of their past actions at a glance. It complements, but does not replace, the detailed `Engage > Campaign Insights` reports.
* **FR-6.3 (NEW): "Potential vs. Actual" Results**
    * Each entry in the history must clearly compare the original forecast with the final, actual result, closing the loop on every opportunity.
    * **Example:**
        * **Goal:** Recover 32 at-risk weekend customers with a potential of RM2,400/monthly.
        * **Result:** Recovered 18 customers, adding RM1,550 in actual monthly revenue.
* **FR-6.4 (NEW): "Success Score" Visual Indicator**
    * Each entry must include a visual cue for quick scanning, such as a percentage (`Success Score: 65% of Goal`) or a simple tag (`[GOAL MET]`, `[PARTIAL SUCCESS]`).
* **FR-6.5 (NEW): Smart "Drill-Down" Links**
    * To provide full context without clutter, each entry will contain two distinct links:
        * **`[View Campaign Insights]`**: Links to the existing, detailed campaign performance report in the "Engage" module.
        * **`[View Original Analysis]`**: Links to a read-only view of the original "Prove It" modal, reminding the merchant of the starting point and rationale for the opportunity.

---

### **7. Non-Functional Requirements**
* **Performance:** The dashboard widget must load in under 2 seconds. The "Prove It" modal analytics must render in under 3 seconds.
* **Security:** All communication between the front-end and the backend services must be over HTTPS. The Growth-Insights-Service must adhere to strict data tenancy, ensuring one merchant can never access another's data.
* **Scalability:** The backend microservice architecture must be able to scale horizontally to handle analysis for thousands of merchants simultaneously.
* **Usability:** The entire workflow from seeing an opportunity to launching a campaign must be completable in under 60 seconds by a non-technical user.
* **Branding:** The interface must maintain authentic StoreHub branding with black (#1A1A1A) and orange (#FF6B35) color scheme throughout.

---

### **8. Success Metrics & KPIs**
* **Primary KPI:** Revenue generated from campaigns launched via an Opportunity card (tracked via Campaign Insights).
* **Secondary KPIs:**
    * "Engage" add-on subscription rate.
    * Churn rate for "Engage" subscribers.
    * Opportunity-to-Campaign launch rate (CTR of the `[Launch Campaign]` button).
    * Merchant satisfaction score (NPS) related to the new dashboard.

---

### **9. Out-of-Scope (For Hackathon/Phase 1)**
* Building the real backend engine (heuristics or otherwise). This will be simulated.
* Building the data pipeline or integrating with the real Amazon Redshift database. This will be simulated.
* The "CEO-in-a-Box" weekly briefing.

---

### **10. High-Level Architectural Considerations**

* **Front-end:** Vanilla JavaScript (ES6+), HTML5, CSS3 for hackathon prototype. React or Vue.js for production.
* **Back-end (Phased Rollout):** The **Growth-Insights-Service** will be developed following a phased approach to manage complexity.
    * **Phase 2:** It will begin as a well-defined, isolated module within the existing application monolith.
    * **Phase 3:** Once stable and proven, it will be extracted into a fully independent microservice to allow for separate scaling and deployment.
* **Database:** Existing **MongoDB** for transactional data. **Amazon Redshift** will be the source for all complex analytical queries.
* **Critical Dependency - Data Pipeline:** The success of this project hinges on a robust and reliable **ETL/ELT (Extract, Transform, Load) pipeline.** Dedicated data engineering resources must be allocated to build and maintain the process of moving and transforming data from MongoDB into Amazon Redshift for consumption by the Growth-Insights-Service.
* **Infrastructure:** Cloud-based (AWS) using Docker/Kubernetes for future microservice deployment. AWS Lambda for scheduled tasks.

---

### **11. Team Considerations**

To ensure success, this project requires a cross-functional team, including:
* Front-End Developer(s)
* Back-End Developer(s)
* **Data Engineer / Analyst:** A dedicated role responsible for the critical data pipeline (ETL/ELT) between MongoDB and Redshift, and for defining and refining the business logic heuristics.

---

### **12. Development Workflow & Tooling Guidelines**

This section outlines the expected workflow and usage of the primary development tool, Cursor, to ensure a well-documented, efficient, and collaborative process.

* **12.1: Proactive AI Guidance**
    * **Requirement:** The developer should actively use Cursor's AI chat as a "pair-programming partner." This includes asking for guidance on best practices, requesting boilerplate code for components, generating functions based on comments, and debugging complex issues to accelerate development.

* **12.2: Integrated Version Control**
    * **Requirement:** The developer must leverage Cursor's integrated Git and GitHub features to manage all source code. Commits should be made frequently after completing small, logical units of work.
    * **Requirement:** Cursor's AI capabilities should be used to help write clear, descriptive commit messages that explain the "why" behind a change, ensuring a clean and understandable version history.

* **12.3: Progress Logging and Task Tracking**
    * **Requirement:** A `CHANGELOG.md` file must be created and maintained at the root of the project repository.
    * **Requirement:** After committing a new feature or a significant fix, the developer will use Cursor to help update the `CHANGELOG.md` file, documenting the change concisely. This provides a running log of progress that is easily accessible to leadership and other stakeholders.

---

### **13. Proposed Technology Stack & Implementation**

* **Phase 1 (Hackathon):**
    * **IDE:** **Cursor** (to be used as specified in the Workflow Guidelines above).
    * **Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3.
    * **Data Visualization:** Chart.js for interactive charts and graphs.
    * **Branding:** Authentic StoreHub black (#1A1A1A) and orange (#FF6B35) color scheme.
    * **Methodology:** Simulated backend using `mockData.js`. Focus is 100% on a polished, high-fidelity UX prototype that tells a complete story and maximizes visual impact for leadership.
* **Phase 2 (Production Build - Heuristics Engine):**
    * **IDE:** Cursor, VS Code.
    * **Stack:** React/Vue.js, Python (for the analytics module), AWS (Redshift, Lambda).
    * **Methodology:** Full-code development of the heuristics-based engine as an internal module, with a fully integrated data pipeline.

---

### **14. Future Considerations & Phases**

* **Phase 1a/b (Quick Follow-ups):** Implement the ROI/Discount slider and "CEO-in-a-Box" weekly briefing.
* **Phase 2:** Build the real, production-ready heuristics engine and the supporting data pipeline.
* **Phase 3:**
    * Extract the `Growth-Insights-Service` into a full microservice.
    * Begin R&D on targeted **Machine Learning models** to augment and outperform the rule-based heuristics in specific areas (e.g., predictive churn models). This allows for a data-driven evolution towards more complex AI.

---

### **15. Implementation Status (Phase 1 Hackathon)**

**Current Status:** Phase 1C Complete (January 15, 2025)

**Completed Features:**
* ✅ Responsive dashboard with authentic StoreHub branding
* ✅ Today's Opportunities widget with Malaysian-localized content
* ✅ Interactive opportunity cards for Mama Kopitiam (Alia)
* ✅ "Prove It" justification modal with Chart.js data visualizations
* ✅ CSV export functionality for raw data download
* ✅ Complete workflow: opportunity discovery → analysis → campaign launch
* ✅ Mobile-first responsive design with collapsible navigation
* ✅ Performance targets achieved: <2s dashboard load, <3s modal render, <60s workflow

**Next Phase:** Phase 1D - Campaign Integration & Workflow System

**Demo Readiness:** 🎉 **MAJOR BREAKTHROUGH ACHIEVED** - Core workflow fully functional (Phase 1F complete with all critical issues resolved)