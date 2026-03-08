import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            <h1 className="text-3xl font-serif font-bold gold-text">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last Updated: March 2026</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Welcome to AZERA CLUB, a premium lifestyle management platform designed to help users organise luxury experiences, travel, properties, networking events, and personal wellness in one intelligent environment.
          </p>
          <p className="text-sm text-muted-foreground">By accessing or using the AZERA CLUB platform, you agree to comply with these Terms of Service.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">1. Platform Usage</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">AZERA CLUB provides digital tools that allow users to manage lifestyle activities such as travel planning, event discovery, property portfolios, and wellness schedules.</p>
            <p className="text-sm text-muted-foreground">Users agree not to:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>Misuse or exploit the platform</li>
              <li>Attempt to bypass security measures</li>
              <li>Distribute malicious software</li>
              <li>Use the platform for illegal activities</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">2. User Accounts</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Users are responsible for maintaining the confidentiality of their login credentials and for all activities conducted through their account.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">3. Subscription Services</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Certain features require an active subscription. Plan pricing and included features may change over time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">4. Data Ownership</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Users retain ownership of their personal data. AZERA CLUB processes data solely to provide services and platform functionality.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">5. Platform Availability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">AZERA CLUB aims to maintain continuous service availability but may occasionally perform maintenance or upgrades.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">6. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">AZERA CLUB is not responsible for losses caused by third-party services such as travel providers, event organisers, or hospitality partners.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">7. Account Suspension</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Accounts may be suspended or terminated if users violate these Terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-semibold">8. Changes to Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">These Terms may be updated periodically. Continued use of the platform indicates acceptance of updated terms.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}