import React from 'react';
import { Briefcase, Heart, Trophy, Target, Coffee, Brain } from 'lucide-react';

function About() {
  return (
    <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Professional Journey
          <Briefcase className="inline-block ml-2 text-blue-500" />
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Trophy className="text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-purple-600">Planning Specialist</h3>
              <p className="text-gray-700">
                With years of experience in strategic planning and project coordination, I specialize in turning complex ideas into actionable plans.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Target className="text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-purple-600">Key Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Strategic planning and resource allocation</li>
                <li>Project timeline development and management</li>
                <li>Stakeholder coordination and communication</li>
                <li>Risk assessment and mitigation strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Skills & Expertise
          <Brain className="inline-block ml-2 text-indigo-500" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-purple-600 mb-3">Technical Skills</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Project Management Software</li>
              <li>Resource Planning Tools</li>
              <li>Data Analysis & Reporting</li>
              <li>Timeline Management</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-purple-600 mb-3">Soft Skills</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Strategic Thinking</li>
              <li>Team Coordination</li>
              <li>Problem Solving</li>
              <li>Communication</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border-4 border-blue-400 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Work Philosophy
          <Coffee className="inline-block ml-2 text-brown-500" />
        </h2>
        <div className="text-center space-y-4 text-gray-700">
          <p>
            I believe in creating structured, achievable plans while maintaining flexibility for unexpected challenges.
          </p>
          <p>
            My approach combines analytical thinking with creative problem-solving to deliver optimal results.
          </p>
          <div className="mt-6">
            <Heart className="inline-block text-red-500 animate-pulse" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;