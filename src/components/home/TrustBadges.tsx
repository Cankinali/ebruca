export default function TrustBadges() {
  const badges = [
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: '256 Bit SSL',
      subtitle: 'Güvenli alışveriş',
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '3D Secure',
      subtitle: 'Güvenli ödeme',
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Ücretsiz Kargo',
      subtitle: '3.000 TL üzeri',
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: '3 Taksit',
      subtitle: '5.000 TL üzeri',
    },
    {
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: 'Canlı Destek',
      subtitle: 'WhatsApp',
    },
  ];

  return (
    <section className="border-y border-gray-100 py-5 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className={`flex flex-col items-center text-center gap-1 sm:gap-2 ${
                /* Mobilde 3 kolon: 5. badge ortaya al */
                i === 3 ? 'col-start-1' : i === 4 ? 'col-start-3' : ''
              } sm:col-auto`}
            >
              <div className="text-black">{badge.icon}</div>
              <div>
                <p className="text-[10px] sm:text-sm font-semibold tracking-wide leading-tight">{badge.title}</p>
                <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 leading-tight">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
