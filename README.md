🔐 AI-Assisted Firewall Rule Generator

An educational, security-focused web application that helps CS students and security beginners translate high-level server requirements into secure, least-privilege firewall rules — while clearly explaining why those rules matter.

🚩 Problem
Writing firewall rules is deceptively hard.

Beginners often:
Open ports too broadly (e.g., SSH to the world)
Skip default-deny policies
Copy configurations without understanding the security impact
This tool addresses that gap by pairing AI-assisted rule generation with explicit security explanations, warnings, and comparisons — helping users learn access control conceptually, not just syntactically.

🎯 Target Audience
CS students learning networking fundamentals
Security beginners exploring firewall concepts
Learners preparing for cloud, infra, or cybersecurity roles

🧠 What This App Does
Users describe a server in plain English, select structured inputs, or both:
“Web server with SSH access”

The app generates:
Secure iptables firewall rules
A default-deny configuration
Clear explanations for each rule
Security warnings for risky assumptions
A Least-Privilege Score to quantify security posture
This is an educational tool only — no rules are executed.

✨ Core Features
🔹 Dual Input System
Plain-English descriptions
Structured form inputs (server role, protocols, source IPs)

🔹 Secure Rule Generation
Linux iptables rules
Explicit allow rules only
Default deny-all policy enforced

🔹 Plain-English Explanations
What each rule does
Why it exists
Which attack vectors it helps mitigate

🔹 Security Warnings
Overly broad access (e.g., SSH open to 0.0.0.0/0)
Missing deny-all logic
Common beginner misconfigurations

🔹 Least-Privilege Score (0–100)
Quantifies how restrictive the configuration is
Explains where points were gained or lost

🔹 Secure vs Insecure Comparison
Shows how similar setups are commonly misconfigured
Explains why the generated rules are safer

🧠 AI Behavior & Safety Constraints
The AI is intentionally constrained to prevent unsafe output:
Uses known-safe ports only
Enforces default-deny policies
Avoids wildcard rules unless explicitly requested
Asks follow-up questions if input is vague
Never executes system commands
This design reflects the reality that AI is a decision-support tool, not a security authority.

📚 Learning & Reflection Panel
The app explicitly teaches:
Attack vectors prevented (port scanning, brute force, lateral movement)
Common firewall mistakes beginners make
What could go wrong if AI-generated security configs are blindly trusted

🛠️ Tech Stack
Frontend: HTML, Tailwind CSS, JavaScript
AI Integration: Mock responses
Deployment: Bolt.ai

🚫 Non-Goals
No live firewall execution
No SSH access or credential handling
No cloud firewall rules (v1 is Linux-focused)

🔍 What I Learned Building This
Why default-deny is foundational to network security
How vague requirements lead to insecure access rules
Where AI helps (speed, explanation) and where it fails (context, risk judgment)
Why security tools must teach, not just generate output

🌐 Live Demo
👉 Try the app here:
https://ai-firewall-rule-gen-zlw1.bolt.host

<img width="1327" height="827" alt="Screenshot 2025-12-17 022400" src="https://github.com/user-attachments/assets/aa2d3a18-0fd6-49ee-8510-b73cb5c40da8" />
<img width="1320" height="822" alt="Screenshot 2025-12-17 022523" src="https://github.com/user-attachments/assets/8daf3120-80fc-4be8-bb83-5b189bbb5112" />
<img width="1319" height="818" alt="Screenshot 2025-12-17 022544" src="https://github.com/user-attachments/assets/45a2ddba-c151-4811-894a-f306027e208f" />
<img width="1320" height="820" alt="Screenshot 2025-12-17 022600" src="https://github.com/user-attachments/assets/d0c814a8-93f9-4db4-af77-ba7c6d10e6e0" />

