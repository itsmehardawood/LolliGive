import React, { useState } from 'react';
import { Menu, X, CheckCircle, Users, CreditCard, BarChart, QrCode, Globe } from 'lucide-react';

export default function LolliGiveLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 bg-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LG</span>
                </div>
                <span className="ml-2 text-2xl font-bold text-black">LolliGive</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-red-700 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-red-700 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-red-700 transition-colors font-medium">Success Stories</a>
              <div className="flex space-x-4">
                <button className="px-6 py-2 text-red-700 border-2 border-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold">Login</button>
                <button className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-semibold shadow-lg">Get Started Now</button>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-red-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-md font-medium">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-md font-medium">How It Works</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-md font-medium">Success Stories</a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-3 px-3">
                  <button className="w-full px-4 py-2 text-center text-red-700 border-2 border-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold">Login</button>
                  <button className="w-full px-4 py-2 text-center bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-semibold">Get Started Now</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Effortless Giving.<br />
                <span className="text-red-700">Greater Impact.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                LolliGive provides a secure and branded platform for your organization to manage online donations with ease.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button className="px-8 py-4 bg-red-700 text-white rounded-lg text-lg font-bold hover:bg-red-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Get Started Now
                </button>
                <button className="px-8 py-4 border-2 border-red-700 text-red-700 rounded-lg text-lg font-bold hover:bg-red-50 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="h-16 w-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">CC</span>
                  </div>
                  <h3 className="text-xl font-bold text-black">City Church</h3>
                  <p className="text-gray-500">yourorg.lolligive.com</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-black font-medium">Tithe</span>
                    <span className="text-red-700 font-bold">$150</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-black font-medium">Building Fund</span>
                    <span className="text-red-700 font-bold">$75</span>
                  </div>
                  <button className="w-full py-3 bg-red-700 text-white rounded-lg font-semibold">
                    Give Now
                  </button>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center">
                    <QrCode className="text-white h-16 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
            Get your organization set up and receiving donations in just minutes
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sign Up in Minutes</h3>
              <p className="text-gray-300">Quick setup with just your phone number and OTP verification. No complex paperwork required.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Customize Your Page</h3>
              <p className="text-gray-300">Add your logo, video, and donation purposes. Create a branded experience that reflects your mission.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Share and Receive</h3>
              <p className="text-gray-300">Get your unique link and permanent QR code. Start collecting donations immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">Why Choose LolliGive?</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Everything your organization needs to manage donations professionally
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <CheckCircle className="text-red-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Secure & Trustworthy</h3>
              <p className="text-gray-600">Bank-level security with trusted payment gateways ensures all transactions are safe and compliant.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Globe className="text-red-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Branded Experience</h3>
              <p className="text-gray-600">Each organization gets their own professional-looking page with custom URL and permanent QR code.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <BarChart className="text-red-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Full Control</h3>
              <p className="text-gray-600">Complete admin dashboard for tracking transactions, managing donors, and generating detailed reports.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <CreditCard className="text-red-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Simple Payments</h3>
              <p className="text-gray-600">Accept donations via card or ACH with seamless mobile-friendly payment processing.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Users className="text-red-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Transparent for Donors</h3>
              <p className="text-gray-600">Clean, simple donation process where donors only see the amount they are giving - fees handled on backend.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <QrCode className="text-red-700 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Easy Withdrawals</h3>
              <p className="text-gray-600">Simple fund withdrawal process directly to your bank account with clear reporting and tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section id="testimonials" className="py-16 bg-red-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">Trusted by Organizations</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">PJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-black">Pastor John</h4>
                  <p className="text-gray-600">City Church</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"LolliGive transformed how our congregation gives. The setup was incredibly easy, and our donations increased by 40 percent in the first month."</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SM</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-black">Sarah Martinez</h4>
                  <p className="text-gray-600">Hope Foundation</p>
                </div>
              </div>
              <p className="text-gray-700 italic">The branded experience makes us look professional, and the reporting features help us stay transparent with our supporters.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-black">Michael Roberts</h4>
                  <p className="text-gray-600">Grace Community</p>
                </div>
              </div>
              <p className="text-gray-700 italic">Our members love how simple it is to give. The QR code at our services makes it so convenient for everyone.</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 grayscale">
              <div className="bg-gray-200 px-4 md:px-6 py-2 md:py-3 rounded-lg">
                <span className="font-bold text-gray-600 text-sm md:text-base">CHURCH NETWORK</span>
              </div>
              <div className="bg-gray-200 px-4 md:px-6 py-2 md:py-3 rounded-lg">
                <span className="font-bold text-gray-600 text-sm md:text-base">FAITH ALLIANCE</span>
              </div>
              <div className="bg-gray-200 px-4 md:px-6 py-2 md:py-3 rounded-lg">
                <span className="font-bold text-gray-600 text-sm md:text-base">UNITY FOUNDATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action */}
      <section className="py-16 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Giving?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of organizations using LolliGive to make giving simple, secure, and impactful.
          </p>
          <button className="px-12 py-4 bg-red-700 text-white rounded-lg text-xl font-bold hover:bg-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Join LolliGive and Start Your Mission
          </button>
          <p className="text-gray-400 mt-4">No setup fees • Free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LG</span>
                </div>
                <span className="ml-2 text-xl font-bold text-black">LolliGive</span>
              </div>
              <p className="text-gray-600">
                Making giving simple, secure, and impactful for organizations worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-black mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-red-700 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-red-700 transition-colors">Pricing</a></li>
                <li><a href="#security" className="text-gray-600 hover:text-red-700 transition-colors">Security</a></li>
                <li><a href="#integrations" className="text-gray-600 hover:text-red-700 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-black mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-600 hover:text-red-700 transition-colors">Help Center</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-red-700 transition-colors">Contact Us</a></li>
                <li><a href="#resources" className="text-gray-600 hover:text-red-700 transition-colors">Resources</a></li>
                <li><a href="#status" className="text-gray-600 hover:text-red-700 transition-colors">System Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-black mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-gray-600 hover:text-red-700 transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-600 hover:text-red-700 transition-colors">Terms of Service</a></li>
                <li><a href="#cookies" className="text-gray-600 hover:text-red-700 transition-colors">Cookie Policy</a></li>
                <li><a href="#compliance" className="text-gray-600 hover:text-red-700 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2025 LolliGive. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-red-700 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-700 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-700 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}