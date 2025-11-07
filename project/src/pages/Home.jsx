import { Link } from 'react-router-dom';
import { Code, Users, Award, Rocket } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering Future Developers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join DevYonira Bootcamp and transform your career with hands-on coding experience
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DevYonira?</h2>
          <p className="text-xl text-gray-600">
            We provide comprehensive training to help you succeed in your tech career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Code className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hands-On Projects</h3>
            <p className="text-gray-600">
              Build real-world applications and develop practical coding skills
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Mentors</h3>
            <p className="text-gray-600">
              Learn from industry professionals with years of experience
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Certification</h3>
            <p className="text-gray-600">
              Earn a recognized certificate upon successful completion
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Rocket className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Career Support</h3>
            <p className="text-gray-600">
              Get job placement assistance and career guidance
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Curriculum</h2>
            <p className="text-xl text-gray-600">
              Comprehensive full-stack development program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { phase: 'Phase 1', title: 'HTML & CSS Fundamentals', duration: '4 weeks' },
              { phase: 'Phase 2', title: 'JavaScript Mastery', duration: '6 weeks' },
              { phase: 'Phase 3', title: 'React.js Development', duration: '6 weeks' },
              { phase: 'Phase 4', title: 'Node.js & Express', duration: '5 weeks' },
              { phase: 'Phase 5', title: 'Database Management', duration: '4 weeks' },
              { phase: 'Phase 6', title: 'Final Capstone Project', duration: '5 weeks' }
            ].map((course, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition"
              >
                <div className="text-blue-600 font-semibold mb-2">{course.phase}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600">{course.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join hundreds of students who have already transformed their careers
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Enroll Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
