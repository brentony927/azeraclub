import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold gold-text">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last Updated: March 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">AZERA CLUB respects the privacy of its users and is committed to protecting personal information.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Information We Collect</h2>
            <p className="text-sm text-muted-foreground">We may collect:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Name and email address</li>
              <li>Lifestyle preferences</li>
              <li>Travel information</li>
              <li>Property portfolio details</li>
              <li>Calendar and event data</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">How We Use Information</h2>
            <p className="text-sm text-muted-foreground">Data is used to:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Personalise the user experience</li>
              <li>Provide platform features</li>
              <li>Generate lifestyle recommendations</li>
              <li>Improve system performance</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Data Protection</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">We apply industry-standard security practices to safeguard user data from unauthorised access.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Third-Party Services</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Some platform features may involve third-party services such as travel bookings or event providers. AZERA CLUB is not responsible for the privacy policies of these external providers.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">User Control</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Users can update, export, or delete their personal data within their account settings.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">Contact</h2>
            <p className="text-sm text-muted-foreground">Privacy inquiries can be sent to: <a href="mailto:privacy@azeraclub.com" className="text-primary hover:underline">privacy@azeraclub.com</a></p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}