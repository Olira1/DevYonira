import { Target, Eye, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About DevYonira</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to empowering aspiring developers with the skills and knowledge
            needed to succeed in the tech industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To provide accessible, high-quality coding education that prepares students
              for successful careers in software development through hands-on learning and
              mentorship.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To become the leading bootcamp that bridges the gap between education and
              employment, creating opportunities for individuals to thrive in the digital age.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Values</h3>
            <p className="text-gray-600">
              Excellence, integrity, innovation, and community. We believe in fostering an
              inclusive environment where every student can reach their full potential.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-600">
                From HTML/CSS basics to advanced React and Node.js, our curriculum covers
                everything you need to become a full-stack developer.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Real-World Projects
              </h3>
              <p className="text-gray-600">
                Build a portfolio of projects that demonstrate your skills to potential
                employers and showcase your abilities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Industry Mentorship
              </h3>
              <p className="text-gray-600">
                Learn from experienced developers who provide guidance, code reviews, and
                career advice throughout your journey.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Job Placement Support
              </h3>
              <p className="text-gray-600">
                Get help with resume building, interview preparation, and connecting with
                hiring partners in the tech industry.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg mb-6">
            Have questions? We'd love to hear from you!
          </p>
          <div className="space-y-2">
            <p className="text-blue-100">Email: info@devyonira.com</p>
            <p className="text-blue-100">Phone: +1 (555) 123-4567</p>
            <p className="text-blue-100">Address: 123 Tech Street, San Francisco, CA 94102</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
