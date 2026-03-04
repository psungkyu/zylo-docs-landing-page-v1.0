import React from 'react';

export default function CustomersSection() {
  const customers = [
    {
      name: 'Notifly',
      logo: '/customers/notifly-logo.svg'
    },
    {
      name: 'Pikurate',
      logo: '/customers/pikurate-logo-hover.svg'
    }
  ];

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-b from-transparent to-blue-500/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-mono font-bold mb-4 text-foreground">
            Trusted by fast-moving software teams
          </h2>
{/*           
          <p className="text-lg text-muted-foreground mb-12">
            Leading companies are already using zylo-docs to transform their documentation
          </p> */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 lg:gap-16">
            {customers.map((customer, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center p-6 rounded-lg hover:bg-blue-500/5 transition-all duration-300 group"
              >
                <img
                  src={customer.logo}
                  alt={`${customer.name} logo`}
                  className="h-12 w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>

          {/* <div className="mt-12 pt-12 border-t border-blue-500/10">
            <p className="text-sm text-muted-foreground">
              Join these companies in revolutionizing their documentation workflow
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}