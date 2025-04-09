export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">
        Effective Date: April 7, 2025
      </p>

      <p className="mb-4">
        At Love In Action, we are committed to protecting your privacy. This
        policy explains how we collect, use, and protect your information when
        you use our services, including SMS authentication.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>Your name</li>
        <li>Phone number</li>
        <li>Email address</li>
      </ul>

      <p className="mb-4">
        We collect your phone number to send one-time passcodes (OTPs) for
        secure login and password reset via SMS.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>To verify your identity via OTP</li>
        <li>To respond to support inquiries</li>
        <li>To improve our services</li>
      </ul>

      <p className="mb-4">
        We do not sell, rent, or share your personal information for marketing
        or promotional purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Third-Party Services
      </h2>
      <p className="mb-4">
        We use Bird, a trusted third-party messaging provider, to send OTPs.
        Your phone number is securely shared with Bird for this purpose only.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. SMS Messaging</h2>
      <p className="mb-4">
        By providing your phone number, you agree to receive SMS messages for
        account security. Message and data rates may apply. Reply STOP to opt
        out at any time.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We implement appropriate safeguards to secure your personal data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Access or correct your personal data</li>
        <li>Request deletion of your account</li>
        <li>Opt out of SMS messages</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Data Retention</h2>
      <p className="mb-4">
        We retain personal data only as long as necessary to fulfill its
        intended purpose or as required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
      <p className="mb-4">
        For privacy-related questions, contact us at:{' '}
        <a
          href="mailto:info@loveinaction.co"
          className="text-blue-600 dark:text-blue-400 underline hover:opacity-90 transition"
        >
          info@loveinaction.co
        </a>
      </p>
    </div>
  );
}
