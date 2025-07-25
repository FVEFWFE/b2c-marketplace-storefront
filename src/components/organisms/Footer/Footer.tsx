import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"

export function Footer() {
  return (
    <footer className="bg-primary container">
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* Customer Services Column */}
        <div className="p-6 border rounded-sm">
          <h2 className="heading-sm text-primary mb-3 uppercase">
            Buyer Protection
          </h2>
          <nav className="space-y-3" aria-label="Customer services navigation">
            {footerLinks.customerServices.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        {/* About Column */}
        <div className="p-6 border rounded-sm">
          <h2 className="heading-sm text-primary mb-3 uppercase">About</h2>
          <nav className="space-y-3" aria-label="About navigation">
            {footerLinks.about.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        {/* Trust & Security Column */}
        <div className="p-6 border rounded-sm">
          <h2 className="heading-sm text-primary mb-3 uppercase">Trust & Security</h2>
          <nav className="space-y-3" aria-label="Trust navigation">
            {footerLinks.trust.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>

        {/* Connect Column */}
        <div className="p-6 border rounded-sm">
          <h2 className="heading-sm text-primary mb-3 uppercase">Support</h2>
          <nav className="space-y-3" aria-label="Social media navigation">
            {footerLinks.connect.map(({ label, path }) => (
              <LocalizedClientLink
                key={label}
                href={path}
                className="block label-md"
                target={path.startsWith('http') ? "_blank" : undefined}
                rel={path.startsWith('http') ? "noopener noreferrer" : undefined}
              >
                {label}
              </LocalizedClientLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="py-6 border rounded-sm">
        <p className="text-md text-secondary text-center">
          © 2024 ArbVault. All rights reserved. | Secure marketplace powered by SecureHold Escrow 🛡️
        </p>
        <p className="text-sm text-tertiary text-center mt-2">
          Every transaction protected • ID verified sellers • Insured shipping
        </p>
      </div>
    </footer>
  )
}
