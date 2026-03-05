import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'How it works', href: '#solution' },
    { label: 'Features', href: '#technology' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Blog', href: 'https://blog.zylosystems.com/', external: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img 
            src="/zylo-logo.png" 
            alt="zylo-docs" 
            className="h-12 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors glow-blue">
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {item.label}
              </a>
            ))}
            <a href="https://tally.so/r/wgBlOO" target="_blank" rel="noopener noreferrer" className="w-full px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors glow-blue text-center">
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
