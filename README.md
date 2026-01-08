Learning Lounge,
A modern, responsive web platform built for an IELTS consultancy to showcase its branding, services, testimonials, and provide mock IELTS test experiences for students — all in a single, elegant interface.

🏠 Home Page

Clean hero section with consultancy name, logo, and motto.
“Our Expertise” cards highlighting IELTS preparation, visa guidance, and counseling services.
“Testimonials” carousel showing student reviews.
Integrated MapTiler map displaying the consultancy’s exact location.

🧭 Navigation
Fully responsive top navigation bar (Home, About, Testimonials, Mock Tests, Contact).
Mobile-friendly hamburger menu for smaller screens.

🧪 Mock IELTS Tests Section

Organized into 4 accordions:

Listening Test – Placeholder for future audio-based mock test.
Reading Test – Placeholder for future passage-based questions.
Writing Test – Functional UI with:
Text editor to type written responses.
Image upload option for handwritten answer sheets.
Countdown timer (e.g., 60 minutes).
Speaking Test – Placeholder section for live or recorded interaction.

Each test section expands to explain the official IELTS format (duration, question type, marking scheme) and includes a Start Test button that opens the full-screen test environment.


🧩 Project Structure
├── public/               # Static assets
├── src/                  # App source code
│   ├── components/       # UI components (Navbar, Hero, Accordions, etc.)
│   ├── pages/            # Main pages (Home, Tests, Contact)
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
├── .gitignore            # Ignored files
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation

⚙️ Setup and Installation
1 Clone the Repository
git clone https://github.com/trimstrayy/learningLounge.git
cd learningLounge

2 Install Dependencies
npm install

3 Run the Development Server
npm run dev

Then open your browser at:
👉 http://localhost:..../
## 🔐 Google OAuth Setup

To enable Google sign-in functionality:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure OAuth consent screen if prompted
   - Set Application type to "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:8080/auth/v1/callback`
     - For production: `https://your-domain.com/auth/v1/callback`

4. **Configure Supabase**
   - Go to your Supabase project dashboard
   - Navigate to "Authentication" > "Providers"
   - Enable Google provider
   - Enter your Google Client ID and Client Secret
   - Add redirect URLs matching your app's domain

5. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key
   - Google OAuth is configured entirely in Supabase dashboard
📱 Responsive Design

Layout adapts seamlessly to desktop, tablet, and mobile viewports.

Clean, minimal interface with smooth transitions and clear typography.


🚀 Future Enhancements

Backend integration (Node.js / Django / Supabase) for storing test results.

Add real IELTS listening and reading question data.

Integrate writing evaluation using OpenAI or custom scoring logic.

Include authentication for students and admin dashboards.

Add scheduling and result history tracking.


👨‍💻 Developer Notes

The site currently uses placeholder data for test questions and instructions.

Writing test is interactive and supports both text and image submissions.

All components are structured and commented for easy backend linkage later.