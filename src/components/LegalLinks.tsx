import { useState } from 'react';
import { Link } from 'react-router-dom';
import LegalModal from './LegalModal';

interface LegalLinksProps {
  variant?: 'footer' | 'signup';
  className?: string;
}

export default function LegalLinks({ variant = 'footer', className = '' }: LegalLinksProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const openModal = (type: 'privacy' | 'terms') => {
    if (type === 'privacy') {
      setModalContent({
        title: 'Privacy Policy',
        content: (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Last updated: January 26, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p>
                Welcome to Lounge Learning ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our IELTS preparation platform.
              </p>
              <p>
                By using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li><strong>Personal Information:</strong> Email addresses, full names, and target IELTS scores provided during registration and profile setup.</li>
                <li><strong>Test Data:</strong> For Speaking tests, we record audio submissions. For Writing tests, we collect text responses you provide.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our platform, including test attempts, progress tracking, and feature usage.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>To provide and maintain our IELTS preparation services</li>
                <li>To evaluate your test submissions using AI-powered analysis</li>
                <li>To track your progress and provide personalized feedback</li>
                <li>To communicate with you about your account and our services</li>
                <li>To improve our platform and develop new features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties, except as described in this policy.
              </p>
              <p>
                We use third-party AI services (OpenAI and Groq APIs) to evaluate your test submissions. Your audio recordings and text responses are sent to these providers solely for the purpose of generating scores and feedback. This data is processed temporarily and is not stored or used by these providers for any other purposes.
              </p>
              <p>
                We may disclose your information if required by law or to protect our rights and safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p>
                Audio recordings from Speaking tests are stored in Supabase Storage. You can request deletion of your audio recordings at any time by contacting us. Other personal information is retained as long as your account is active or as needed to provide our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Access: Request a copy of the personal information we hold about you</li>
                <li>Correction: Request correction of inaccurate or incomplete information</li>
                <li>Deletion: Request deletion of your personal information, including audio recordings</li>
                <li>Portability: Request transfer of your data in a structured format</li>
                <li>Objection: Object to processing of your personal information</li>
              </ul>
              <p>To exercise these rights, please contact us using the information provided below.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-4">
                Email: lexoraielts@gmail.com<br />
                Address: Banepa-9, Kavre, Nepal
              </p>
            </section>
          </>
        )
      });
    } else {
      setModalContent({
        title: 'Terms of Service',
        content: (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Last updated: January 26, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p>
                Welcome to Lounge Learning. These Terms of Service ("Terms") govern your use of our IELTS preparation platform. By accessing or using our service, you agree to be bound by these Terms.
              </p>
              <p>
                If you do not agree to these Terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use of Service</h2>
              <p>
                Our platform provides practice tests and AI-powered evaluation for IELTS preparation. You may use our service for personal, non-commercial purposes only.
              </p>
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400 mt-4">
                <h3 className="font-bold text-red-900 mb-3 text-lg">AI Accuracy Disclaimer</h3>
                <p className="text-red-800 font-medium mb-2">
                  LEXORA is an independent practice tool and is not affiliated with, approved by, or endorsed by IDP Education, British Council, or Cambridge English.
                </p>
                <p className="text-red-800">
                  Estimated Band Scores are generated by AI for practice purposes only and do not guarantee results in official IELTS exams. These scores have no legal standing and cannot be used as evidence of English proficiency for immigration, academic, or professional purposes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
              <p>
                To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                You must provide accurate and complete information when creating your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Fair Use and Prohibited Activities</h2>
              <p>
                You agree not to use bots, scripts, or automated tools to scrape or access our exam content. Such activities are strictly prohibited and may result in account suspension or termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Content</h2>
              <p>
                You must not submit content generated by other AI tools (such as ChatGPT, Claude, or similar language models) for evaluation on our platform. All submissions must be your original work.
              </p>
              <p>
                Violation of this policy may result in immediate account termination and forfeiture of any unused credits or subscriptions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Conduct</h2>
              <p>
                You agree to use our service responsibly and in compliance with applicable laws. We reserve the right to terminate your account for fraudulent activity or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content and Intellectual Property</h2>
              <p>
                All content on our platform, including test questions, materials, and AI-generated feedback, is owned by Lounge Learning or our licensors and is protected by copyright and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, or create derivative works from our content without prior written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payments</h2>
              <p>
                Some features of our platform may require payment for access. Premium features are digital products and are non-refundable once used or accessed.
              </p>
              <p>
                All payments are processed securely through our payment providers. Prices are subject to change with notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Requirements</h2>
              <p>
                You are responsible for ensuring that your hardware and internet connection meet the minimum technical requirements for using our platform. This includes:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>A functioning microphone for Speaking tests</li>
                <li>A stable internet connection for real-time features</li>
                <li>A compatible web browser and device</li>
              </ul>
              <p>
                We cannot provide refunds or credits for test failures caused by inadequate hardware, poor internet connectivity, or device malfunctions on the user's end.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account and access to our service at our discretion, with or without cause, and with or without notice.
              </p>
              <p>
                Upon termination, your right to use our service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
              <p>
                Our service is provided "as is" without warranties of any kind. We do not guarantee that our service will be uninterrupted, error-free, or meet your specific requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p>
                In no event shall Lounge Learning be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page.
              </p>
              <p>
                Your continued use of our service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-4">
                Email: lexoraielts@gmail.com<br />
                Address: Banepa-9, Kavre, Nepal
              </p>
            </section>
          </>
        )
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  if (variant === 'signup') {
    return (
      <>
        <span className={className}>
          I agree to the{' '}
          <button
            type="button"
            onClick={() => openModal('terms')}
            className="text-primary hover:underline underline"
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button
            type="button"
            onClick={() => openModal('privacy')}
            className="text-primary hover:underline underline"
          >
            Privacy Policy
          </button>
        </span>
        {modalContent && (
          <LegalModal
            isOpen={modalOpen}
            onClose={closeModal}
            title={modalContent.title}
            content={modalContent.content}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`flex gap-4 ${className}`}>
        <button
          onClick={() => openModal('privacy')}
          className="hover:underline"
        >
          Privacy Policy
        </button>
        <span className="text-primary-foreground/50">|</span>
        <button
          onClick={() => openModal('terms')}
          className="hover:underline"
        >
          Terms of Service
        </button>
      </div>
      {modalContent && (
        <LegalModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={modalContent.title}
          content={modalContent.content}
        />
      )}
    </>
  );
}