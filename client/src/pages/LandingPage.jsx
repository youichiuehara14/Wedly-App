import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import wedpic from '/src/assets/wedpic.jpg';
import {
  Heart,
  Calendar,
  Users,
  CheckCircle,
  ArrowRight,
  Gem,
  User,
  UserCheck,
  ShieldUser,
} from 'lucide-react';
import NavbarLandingPage from '../components/NavbarLandingPage';

export default function WeddingPlannerLandingPage() {
  const [animatedSections, setAnimatedSections] = useState(new Set());

  // Refs for sections to animate
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAnimatedSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe sections
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);

    return () => observer.disconnect();
  }, []);

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <NavbarLandingPage />
      {/* Page Content */}
      <div
        style={{
          backgroundImage: `url(${wedpic})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          height: '400px',
        }}
        className="min-h-screen font-sans pt-16"
      >
        {' '}
        {/*bg-gradient-to-b from-stone-700 to-white*/}
        <div>
          <section id="hero" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                  className="text-4xl md:text-5xl font-bold tracking-wider"
                >
                  Plan Your Perfect Day With <span className="text-yellow-500">Ease</span>
                </h1>
                <p
                  style={{ fontFamily: "'Cinzel', serif" }}
                  className="mt-6 text-lg text-black leading-relaxed"
                >
                  Your comprehensive wedding planning companion that helps you organize every detail
                  of your special day—from venues to vendors, budgets, to timelines.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={handleRegisterClick}
                    style={{ fontFamily: "'Cinzel', serif" }}
                    className="bg-yellow-500 text-white px-8 py-3 rounded-full hover:bg-yellow-600 transition-colors font-medium flex items-center"
                  >
                    Register here <ArrowRight className="ml-2" size={18} />
                  </button>
                  <button
                    onClick={() =>
                      window.open('https://www.youtube.com/watch?v=UDzCkMyWW5I', '_blank')
                    }
                    style={{ fontFamily: "'Cinzel', serif" }}
                    className="border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-full hover:bg-yellow-50 transition-colors font-medium"
                  >
                    Watch Planning Tips
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-pink-100 rounded-xl p-2 shadow-lg">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Wedding planning on a tablet"
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <span className="text-sm font-medium">80% less stress!</span>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <div className="flex items-center">
                    <Heart className="text-pink-500 mr-2" size={20} />
                    <span className="text-sm font-medium">1000+ happy couples</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" ref={featuresRef} className="py-16 bg-white px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div
                className={`text-center mb-16 fade-in-up ${
                  animatedSections.has('features') ? 'animate' : ''
                }`}
              >
                <h2
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl md:text-4xl font-bold text-gray-800"
                >
                  Everything You Need In One Place
                </h2>
                <p
                  style={{ fontFamily: "'Cinzel', serif" }}
                  className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
                >
                  Our comprehensive tools make wedding planning a joy instead of a chore
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div
                  style={{ backgroundColor: '#2d2f25' }}
                  className={`p-8 rounded-xl fade-in-up stagger-1 ${
                    animatedSections.has('features') ? 'animate' : ''
                  }`}
                >
                  <Calendar className="text-yellow-500 mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-white mb-3">Smart Planning</h3>
                  <p className="text-white">
                    Organize timelines, budget, and to-dos, and with our intuitive planning tools.
                    Never miss a deadline again.
                  </p>
                </div>

                <div
                  style={{ backgroundColor: '#2d2f25' }}
                  className={`p-8 rounded-xl fade-in-up stagger-2 ${
                    animatedSections.has('features') ? 'animate' : ''
                  }`}
                >
                  <Users className="text-yellow-500 mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-white mb-3">Guest Management</h3>
                  <p className="text-white">
                    Track RSVPs, meal preferences, and seating arrangements with ease. Keep everyone
                    happy and organized.
                  </p>
                </div>

                <div
                  style={{ backgroundColor: '#2d2f25' }}
                  className={`p-8 rounded-xl fade-in-up stagger-3 ${
                    animatedSections.has('features') ? 'animate' : ''
                  }`}
                >
                  <Heart className="text-yellow-500 mb-4" size={32} />
                  <h3 className="text-xl font-semibold text-white mb-3">Vendor Directory</h3>
                  <p className="text-white">
                    Find and book trusted vendors who match your style and budget. Read reviews from
                    other couples.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section
            id="testimonials"
            ref={testimonialsRef}
            style={{ backgroundColor: '#2d2f25' }}
            className="py-16 px-6 md:px-12"
          >
            <div className="max-w-7xl mx-auto">
              <div
                className={`text-center mb-16 fade-in-up ${
                  animatedSections.has('testimonials') ? 'animate' : ''
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Loved By Couples Everywhere
                </h2>
                <p className="mt-4 text-lg text-gray-100 max-w-2xl mx-auto">
                  Hear from couples who planned their dream wedding with our app
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div
                  className={`bg-white p-8 rounded-xl shadow-sm fade-in-left stagger-1 ${
                    animatedSections.has('testimonials') ? 'animate' : ''
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Gem className="text-yellow-500 mb-4" size={32} />
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">Sarah & Michael</h4>
                      <p className="text-sm text-gray-500">June 2024</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "This app saved our wedding! The planning tools kept us on track, and the budget
                    feature helped us save thousands. We couldn't have done it without Forever
                    After!"
                  </p>
                </div>

                <div
                  className={`bg-white p-8 rounded-xl shadow-sm fade-in-right stagger-2 ${
                    animatedSections.has('testimonials') ? 'animate' : ''
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <Gem className="text-yellow-500 mb-4" size={32} />
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">David & James</h4>
                      <p className="text-sm text-gray-500">March 2025</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "The guest management feature was a lifesaver! We were able to track RSVPs,
                    dietary restrictions, and even manage our thank-you notes all in one place."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section ref={pricingRef} id="pricing" className="py-16 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
              <div
                className={`text-center mb-12 fade-in-up ${
                  animatedSections.has('features') ? 'animate' : ''
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Plans that grow with you
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose the perfect plan for your wedding planning needs
                </p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-100 rounded-full p-1">
                  <button className="px-6 py-2 rounded-full bg-white text-gray-800 font-medium shadow-sm">
                    Plan
                  </button>
                  <button className="px-6 py-2 rounded-full text-gray-600 font-medium">
                    Team & Enterprise
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div
                  className={`border border-gray-200 rounded-xl overflow-hidden bg-white fade-in-up stagger-1 ${
                    animatedSections.has('features') ? 'animate' : ''
                  }`}
                >
                  <div className="p-8">
                    <div className="mb-4">
                      <User className="text-yellow-500 mb-4" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Free</h3>
                    <p className="text-gray-600 mb-6">Try Wedding Planner</p>
                    <p className="text-4xl font-bold text-gray-800 mb-1">$0</p>
                    <p className="text-gray-600 mb-8">Access it free!</p>

                    <button className="w-full py-3 border-2 border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Stay on Free plan
                    </button>
                  </div>

                  <div className="border-t border-gray-200 p-8">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">
                          Guest list management (up to 50 guests)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Basic timeline planning</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Budget tracking essentials</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Inspiration board</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pro Plan */}
                <div
                  className={`border border-gray-200 rounded-xl overflow-hidden bg-white fade-in-up stagger-1 ${
                    animatedSections.has('features') ? 'animate' : ''
                  }`}
                >
                  <div className="p-8">
                    <div className="mb-4">
                      <UserCheck className="text-yellow-500 mb-4" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Pro</h3>
                    <p className="text-gray-600 mb-6">Unli planning</p>
                    <p className="text-4xl font-bold text-gray-800 mb-1">$17</p>
                    <p className="text-gray-600 mb-8">/ month billed annually</p>

                    <button className="w-full py-3 bg-teal-500 rounded-full text-white font-medium hover:bg-teal-600 transition-colors">
                      Get Pro plan
                    </button>
                  </div>

                  <div className="border-t border-gray-200 p-8">
                    <p className="font-medium text-gray-800 mb-4">Everything in Free, plus:</p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Unlimited guests</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Access to all timeline templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Advanced budget tools</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Extended vendor directory</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Connect with wedding venues</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Max Plan */}
                <div
                  className={`border border-blue-100 rounded-xl overflow-hidden bg-white shadow-md relative fade-in-up stagger-3 ${
                    animatedSections.has('features') ? 'animate' : ''
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                  <div className="p-8">
                    <div className="mb-4">
                      <ShieldUser className="text-yellow-500 mb-4" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Max</h3>
                    <p className="text-blue-600 mb-6">5-20x more features than Pro</p>
                    <p className="text-4xl font-bold text-gray-800 mb-1">From $100</p>
                    <p className="text-gray-600 mb-8">/ month billed monthly</p>

                    <button className="w-full py-3 bg-emerald-600 rounded-full text-white font-medium hover:bg-emerald-700 transition-colors">
                      Get Max plan
                    </button>
                  </div>

                  <div className="border-t border-gray-200 p-8">
                    <p className="font-medium text-gray-800 mb-4">Everything in Pro, plus:</p>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">
                          Premium support with dedicated planner
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Higher customization options</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Access to exclusive vendor deals</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Premium integrations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">White-glove assistance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-6 md:px-12">
            <div
              // style={{ backgroundColor: "#FFD700" }}
              className={`max-w-4xl mx-auto bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-2xl p-8 md:p-12 text-center text-whitescale-in ${
                animatedSections.has('cta') ? 'animate' : ''
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Plan Your Dream Wedding?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto">
                Join thousands of happy couples who planned their perfect day with ease.
              </p>
              <button className="bg-white text-yellow-500 px-8 py-3 rounded-full hover:bg-yellow-50 transition-colors font-medium">
                Get Started For Free
              </button>
              <p className="mt-4 text-sm opacity-80">No credit card required. 14-day free trial.</p>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="bg-gray-800 text-white py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Heart className="text-pink-400 mr-2" size={24} />
                  <span className="text-xl font-semibold">Wedly</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Making wedding planning stress-free since 2025.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-pink-400 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-pink-400 transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-pink-400 transition-colors">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-pink-400 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-pink-400 transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-pink-400 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Stay Updated</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Subscribe to our newsletter for tips and updates.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-700 rounded-l-full px-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button className="bg-emerald-500 text-white rounded-r-full px-4 hover:bg-emerald-600 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
              <p>© 2025 Wedly. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
