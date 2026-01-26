import React from 'react';
import LegalLayout from '@/components/LegalLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Learning Lounge, your IELTS preparation platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Personal Information</h3>
        <p className="mb-4">
          We collect the following personal information:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Email addresses</li>
          <li>Full names</li>
          <li>Target IELTS scores</li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mb-2">AI Processing Data</h3>
        <p className="mb-4">
          For evaluation purposes, we collect:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Audio recordings for Speaking tests</li>
          <li>Text responses for Writing tests</li>
        </ul>
        <p className="mb-4">
          This data is processed using AI technologies to provide feedback and scoring.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use the collected information to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Provide personalized IELTS preparation services</li>
          <li>Evaluate your performance and provide feedback</li>
          <li>Improve our platform and services</li>
          <li>Communicate with you about your account and our services</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
        <p className="mb-4">
          We use third-party AI services for evaluation:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>OpenAI API</li>
          <li>Groq API</li>
        </ul>
        <p className="mb-4">
          Data is sent to these providers solely for scoring and evaluation purposes. We do not sell your data to third parties. Your information is processed in accordance with their respective privacy policies.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage and Retention</h2>
        <p className="mb-4">
          Audio recordings are stored securely in Supabase Storage. You can request deletion of your audio data at any time by contacting us.
        </p>
        <p className="mb-4">
          We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
        </ul>
        <p className="mb-4">
          To exercise these rights, please contact us at [your contact email].
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at [your contact email].
        </p>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;