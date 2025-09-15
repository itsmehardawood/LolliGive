// lib/plans.js
export const plans = [
  {
    id: 'standard',
    name: 'STANDARD',
    subtitle: 'FOR STARTERS',
    price: '$49.99',
    period: 'PER MONTH',
    apiScans: '60 API SCANS',
    gradient: 'from-purple-500 to-purple-700',
    bgGradient: 'from-purple-100 to-purple-50',
    buttonColor: 'bg-purple-500 hover:bg-purple-600',
    features: [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: true },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: true },
      { text: '$0.50/extra scan', included: true }
    ]
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    subtitle: 'RECOMMENDED',
    price: '$79.99',
    period: 'PER MONTH',
    apiScans: '100 API SCANS',
    gradient: 'from-cyan-400 to-blue-500',
    bgGradient: 'from-cyan-50 to-blue-50',
    buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
    popular: true,
    features: [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: true },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: true },
      { text: '$0.50/extra scan', included: true }
    ]
  },
  {
    id: 'custom',
    name: 'CUSTOM',
    subtitle: 'CONTACT SUPPORT',
    price: 'SALES',
    period: 'CUSTOM PRICING',
    apiScans: 'CONTACT US*',
    gradient: 'from-pink-500 to-purple-600',
    bgGradient: 'from-pink-50 to-purple-50',
    buttonColor: 'bg-pink-500 hover:bg-pink-600',
    features: [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: true },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: true },
      { text: 'Custom pricing/options', included: true }
    ]
  }
];

export const getPlanById = (id) => {
  return plans.find(plan => plan.id === id);
};