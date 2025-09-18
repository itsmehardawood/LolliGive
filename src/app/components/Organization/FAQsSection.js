"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection({ faqData }) {
  const {
    faqs = [
      {
        question: "What is LolliGive?",
        answer: "LolliGive is a secure online giving platform that helps individuals, churches, and organizations raise funds, collect tithes, offerings, and support community causes with ease.",
      },
      {
        question: "How do churches and organizations join LolliGive?",
        answer: "Joining is simple and free. Churches and organizations can sign up on our platform, set up their profile, and start receiving donations immediately.",
      },
      {
        question: "Do you charge any fees for registration?",
        answer: "No. Registration on LolliGive is completely free. Our mission is to support giving, not place financial barriers in the way.",
      },
      {
        question: "How secure is LolliGive?",
        answer: "Security is our top priority. We use advanced encryption, PCI-compliant processes, and strict safeguards to ensure all financial and banking information is fully protected.",
      },
      {
        question: "Can each church or organization manage their own donations?",
        answer: "Yes. Every organization has its own dedicated application space with full access to their donation history, donor insights, and account settings.",
      },
      {
        question: "What types of payments are accepted?",
        answer: "LolliGive accepts debit cards, credit cards, and other secure digital payment methods, making giving simple for everyone.",
      },
      {
        question: "Can individuals give to more than one church or cause?",
        answer: "Absolutely. Donors can choose to give to multiple churches or organizations within the LolliGive platform.",
      },
      {
        question: "Is there a mobile app?",
        answer: "Yes. LolliGive is designed to be mobile-friendly and accessible on any device, so donors can give anytime, anywhere.",
      },
      {
        question: "Are donations tax-deductible?",
        answer: "Donations may be tax-deductible depending on the organization's tax status. Donors should check with the specific church or organization they are supporting.",
      },
      {
        question: "Why choose LolliGive?",
        answer: "Because we combine faith, security, and technology to make giving simple. With LolliGive, every contribution is safe, meaningful, and impactful.",
      },
    ]
  } = faqData || {};

  return (
    <section className="py-4 sm:py-12 lg:py-8 bg-gray-100  px-0 sm:px-6 lg:px-0 w-full">
      <div className=" mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-red-900 hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-sm sm:text-base leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}