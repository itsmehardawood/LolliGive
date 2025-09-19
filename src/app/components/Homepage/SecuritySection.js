// // app/components/SecuritySection.jsx
// "use client";

// import { CheckCircle } from "lucide-react";

// export default function SecuritySection() {
//   const leftPoints = [
//     "PCI DSS Compliance – LolliGive adheres to the Payment Card Industry Data Security Standard (PCI DSS) to ensure secure processing, storage, and transmission of cardholder information.",
//     "Advanced Encryption – All sensitive data is encrypted with AES-256 and TLS 1.3 protocols, securing information in transit and at rest.",
//     "Tokenization of Card Data – Raw card numbers are never stored; instead, secure tokens replace them to prevent exposure.",
//     "Multi-Factor Authentication (MFA) – Administrators and organizational users must enable MFA for account protection.",
//     "Role-Based Access Control – Data access is limited by user roles and permissions within each organization’s dedicated space.",
//   ];

//   const rightPoints = [
//     "Fraud Detection & Monitoring – Machine learning–based tools analyze transactions in real time to block suspicious activity.",
//     "Secure Infrastructure – Hosted on ISO 27001–certified cloud providers with DDoS protection, firewalls, and vulnerability monitoring.",
//     "Regular Security Audits & Penetration Testing – Independent firms conduct audits and penetration tests to ensure compliance.",
//     "Continuous Monitoring – 24/7 system monitoring with intrusion detection systems (IDS) and instant alerts.",
//     "Data Privacy Compliance – LolliGive complies with GDPR, CCPA, and other global privacy standards for transparency and care.",
//   ];

//   const BulletList = ({ points }) => (
//     <ul className="space-y-6">
//       {points.map((point, index) => (
//         <li key={index} className="flex items-start gap-3 leading-relaxed">
//           <CheckCircle className="w-5 h-5 text-red-800 shrink-0 mt-1" />
//           <span>{point}</span>
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <section className="py-3 px-6 bg-gray-50 text-gray-900">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-3 sm:mb-2 flex flex-col items-center text-center px-4 pb-20">
//           <h2 className="text-3xl font-bold text-red-800 mb-4">
//             LolliGive Security Measures
//           </h2>
//           <p className="text-lg text-gray-600 max-w-3xl">
//             At LolliGive, protecting your financial information and ensuring the
//             integrity of our platform is our top priority. We have implemented
//             industry-leading security practices to safeguard every transaction
//             and maintain the trust of our churches, organizations, and donors.
//           </p>
//         </div>

//         {/* Bullets Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
//           <BulletList points={leftPoints} />
//           <BulletList points={rightPoints} />
//         </div>
//       </div>
//     </section>
//   );
// }




// app/components/SecuritySection.jsx
"use client";

import { CheckCircle } from "lucide-react";

export default function SecuritySection() {
  const leftPoints = [
    "PCI DSS Compliance – LolliGive adheres to the Payment Card Industry Data Security Standard (PCI DSS) to ensure secure processing, storage, and transmission of cardholder information.",
    "Advanced Encryption – All sensitive data is encrypted with AES-256 and TLS 1.3 protocols, securing information in transit and at rest.",
    "Tokenization of Card Data – Raw card numbers are never stored; instead, secure tokens replace them to prevent exposure.",
    "Multi-Factor Authentication (MFA) – Administrators and organizational users must enable MFA for account protection.",
    "Role-Based Access Control – Data access is limited by user roles and permissions within each organization’s dedicated space.",
  ];

  const rightPoints = [
    "Fraud Detection & Monitoring – Machine learning–based tools analyze transactions in real time to block suspicious activity.",
    "Secure Infrastructure – Hosted on ISO 27001–certified cloud providers with DDoS protection, firewalls, and vulnerability monitoring.",
    "Regular Security Audits & Penetration Testing – Independent firms conduct audits and penetration tests to ensure compliance.",
    "Continuous Monitoring – 24/7 system monitoring with intrusion detection systems (IDS) and instant alerts.",
    "Data Privacy Compliance – LolliGive complies with GDPR, CCPA, and other global privacy standards for transparency and care.",
  ];

  const BulletList = ({ points }) => (
    <ul className="space-y-5 sm:space-y-6">
      {points.map((point, index) => (
        <li
          key={index}
          className="flex items-start gap-3 leading-relaxed text-base sm:text-lg"
        >
          <CheckCircle className="w-5 h-5 text-red-700 shrink-0 mt-1" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="py-5 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-[100rem] mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
            LolliGive Security Measures
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl">
            At LolliGive, protecting your financial information and ensuring the
            integrity of our platform is our top priority. We have implemented
            industry-leading security practices to safeguard every transaction
            and maintain the trust of our churches, organizations, and donors.
          </p>
        </div>

        {/* Bullets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <BulletList points={leftPoints} />
          <BulletList points={rightPoints} />
        </div>
      </div>
    </section>
  );
}
