import React from 'react';
import { ArrowRight, Mail, Linkedin, Github } from 'lucide-react';

export default function CTASection() {
  return (
    <>
      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-r from-blue-500/10 via-amber-500/5 to-green-500/10 border-t border-blue-500/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold font-mono mb-6 text-foreground">
              Ready to Transform Your Docs?
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join teams that have eliminated manual documentation. Start your free trial today and see how zylo-docs can reduce support costs and accelerate user adoption.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 glow-blue">
                Start Free Trial
                <ArrowRight size={20} />
              </a>
              <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg border border-blue-500/30 hover:border-blue-500/60 text-foreground font-semibold transition-all duration-300 hover:bg-blue-500/10 flex items-center justify-center">
                Schedule Demo
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Enterprise support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-blue-500/10 bg-gradient-to-b from-transparent to-blue-500/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/zylo-logo.png" 
                  alt="zylo-docs" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Living Documentation powered by AI. Always in sync with your product.
              </p>
              
              {/* Address */}
              <div className="text-xs text-muted-foreground leading-relaxed">
                <div>Room 309, 535 Bongcheon-ro</div>
                <div>Gwanak-gu, Seoul 08789</div>
                <div>Republic of Korea</div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-mono font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#technology" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-mono font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="https://blog.zylosystems.com/" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                    Blog
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li> */}
                <li>
                  <a href="mailto:sales@zylosystems.com" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-mono font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://ballistic-place-5e1.notion.site/Zylosystems-Privacy-Policy-2393bf1cfda180afa4e0ef42abe8c927" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="https://ballistic-place-5e1.notion.site/Terms-of-Service-2393bf1cfda1805990eefb350d9861e3" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                    Terms
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Compliance
                  </a>
                </li> */}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-blue-500/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Zylosystems. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/engineering-of-zylosystems"
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/zylosystems"
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors text-muted-foreground hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:sales@zylosystems.com"
                className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
