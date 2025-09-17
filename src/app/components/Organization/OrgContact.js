// components/OrgContact.jsx
"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function OrgContact({ contact, org }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact{" "}
            <span style={{ color: org?.theme?.primary || "#2563eb" }}>Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or want to get involved? We would love to hear from you. Reach out using any of the methods below.
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center lg:text-left">
            Get in Touch
          </h3>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Email */}
            <div className="flex items-start p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                style={{ backgroundColor: org?.theme?.primary || "#2563eb" }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
                <p className="text-gray-600 mb-2">Send us a message anytime</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-medium hover:underline transition-colors duration-200"
                  style={{ color: org?.theme?.primary || "#2563eb" }}
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                style={{ backgroundColor: org?.theme?.primary || "#2563eb" }}
              >
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                <p className="text-gray-600 mb-2">Monday - Friday, 9 AM - 5 PM</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="font-medium hover:underline transition-colors duration-200"
                  style={{ color: org?.theme?.primary || "#2563eb" }}
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                style={{ backgroundColor: org?.theme?.primary || "#2563eb" }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Visit Us</h4>
                <p className="text-gray-600 mb-2">Come see us in person</p>
                <p className="text-gray-700">{contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
