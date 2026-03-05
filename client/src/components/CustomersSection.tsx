import React from 'react';

export default function CustomersSection() {
  const customers = [
    { name: 'Notifly', logo: '/customers/notifly-logo.svg' },
    { name: 'Pikurate', logo: '/customers/pikurate-logo-hover.svg' },
  ];

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-b from-transparent to-blue-500/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg text-muted-foreground leading-relaxed mb-6">
            Trusted by fast-moving software teams
          </h2>

          {/* Single row marquee: right → left, one flowing line on all viewports */}
          <div className="w-full overflow-hidden">
            <div className="flex animate-marquee-left w-max gap-4 lg:gap-8">
              {[...customers, ...customers, ...customers, ...customers].map((customer, index) => (
                <div
                  key={`${customer.name}-${index}`}
                  className="flex items-center justify-center shrink-0 px-8 lg:px-12"
                >
                  <img
                    src={customer.logo}
                    alt=""
                    className="h-8 lg:h-10 w-auto opacity-50 grayscale"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}