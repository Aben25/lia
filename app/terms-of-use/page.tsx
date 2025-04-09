export default function TermsOfUse() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-10 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
      <p className="mb-4 text-sm text-gray-500">
        Effective Date: April 7, 2025
      </p>

      <p className="mb-4">
        Welcome to Love In Action. By using our services, including SMS
        verification, you agree to the following terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Eligibility</h2>
      <p className="mb-4">
        You must be at least 13 years old and provide accurate information when
        creating an account.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Service</h2>
      <p className="mb-4">
        You agree to use our service only for lawful purposes. You may not
        misuse our authentication system, attempt unauthorized access, or
        violate any laws.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Account Creation</h2>
      <p className="mb-4">
        Accounts are automatically created upon login using a verified phone
        number or when registering with email. You must provide accurate and
        truthful information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. SMS Authentication</h2>
      <p className="mb-4">
        By submitting your phone number, you agree to receive one-time passcodes
        via SMS for login and password reset purposes. Reply STOP to opt out
        anytime.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Prohibited Use</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Attempt unauthorized access to any part of the system</li>
        <li>Share, sell, or misuse login credentials</li>
        <li>Transmit malicious code or content</li>
        <li>Use the service for fraudulent or illegal purposes</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access if you violate these terms or
        misuse the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Limitation of Liability
      </h2>
      <p className="mb-4">
        We are not liable for any indirect or incidental damages from your use
        of the service, including delayed or failed SMS delivery.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
      <p className="mb-4">
        We may update these terms at any time. Continued use of the service
        means you accept the updated terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
      <p className="mb-4">
        For questions, email us at:{' '}
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
