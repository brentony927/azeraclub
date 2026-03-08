

## Add FAQ and Contact Pages

Two new public pages with prominent links in the Landing page and Footer.

### 1. `src/pages/FAQ.tsx`
- Styled like TermsOfService/PrivacyPolicy (animated `motion.div`, back link to `/`)
- Uses Radix `Accordion` component (already installed) for expandable Q&A
- Questions covering: What is AZERA, free plan, AI features, data privacy, plan differences, cancellation, etc.

### 2. `src/pages/Contact.tsx`
- Same page shell as FAQ (motion animation, back link)
- Contact form: Name, Email, Message fields (using existing Input, Textarea, Button, Label)
- Display `support@azeraclub.com` prominently
- Form shows success toast on submit (no backend needed initially — just `mailto:` or toast confirmation)

### 3. Routing — `src/App.tsx`
- Add 2 public routes: `/faq` and `/contact`

### 4. Navigation Updates
- **`src/components/Footer.tsx`**: Add "FAQ" and "Contact" links
- **`src/pages/Landing.tsx`**: Add FAQ and Contact links in the final CTA section or as a visible nav row before the footer

