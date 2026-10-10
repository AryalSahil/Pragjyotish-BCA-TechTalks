import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users2, Shield, Mail, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { ImageFallback } from '../components/common/ImageFallback';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 pb-20 space-y-16">
      
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block mb-2">
          Academic Initiative
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          About Pragjyotish BCA TechTalks
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          A dedicated student-focused technology seminar, code lab, and mentorship platform founded to empower undergraduates in computer applications with practical modern engineering capabilities.
        </p>
      </section>

      {/* Main Campus Image Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-21/9 shadow-xs">
          <ImageFallback
            src="/src/assets/images/college_campus_guwahati_1791614221846.jpg"
            alt="Pragjyotish College Academic Grounds in Guwahati"
            className="w-full h-full object-cover"
            fallbackText="Pragjyotish College Campus"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white max-w-xl">
              <span className="text-xs text-blue-300 font-semibold block mb-1">Guwahati, Assam</span>
              <p className="text-sm sm:text-base font-semibold">
                Nurturing software talent in the heart of the Brahmaputra Valley through continuous peer learning and industry interaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives & Mission */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-900">
              <Target className="w-5 h-5 text-blue-800" />
              <h2 className="text-xl font-bold tracking-tight">Our Core Mission</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard academic curricula in computer applications offer a robust theoretical base in mathematics, C, C++, and basic DBMS. However, industry requirements rapidly demand containerization, reactive frameworks, cloud telemetry, CI/CD pipelines, and application security.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pragjyotish BCA TechTalks closes this crucial gap by organizing structured technical seminars, hands-on labs, code review circles, and discussions delivered by practicing software professionals, alumni, and passionate faculty researchers.
            </p>
          </div>

          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="w-5 h-5 text-blue-800" />
              <h2 className="text-xl font-bold tracking-tight">Key Objectives</h2>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span><strong>Practical Technology Awareness:</strong> Familiarize students with contemporary tech stacks (Next.js, Docker, Kubernetes, Linux, Vector DBs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span><strong>Laboratory-First Learning:</strong> Emphasize terminal proficiency, Git collaboration, and deployable code rather than slide-only lectures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span><strong>Industry Demystification:</strong> Connect students with tech leads from regional hubs and national tech companies to clarify real hiring standards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span><strong>Academic Integrity & Open Source:</strong> Encourage responsible coding habits, open documentation, and ethical research practices.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Organizing Structure & Departmental Affiliation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2.5 text-blue-900">
            <Users2 className="w-5 h-5 text-blue-800" />
            <h2 className="text-xl font-bold tracking-tight">Organizing Structure & Affiliation</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Pragjyotish BCA TechTalks is coordinated collaboratively by senior undergraduate students of the <strong>Bachelor of Computer Applications (BCA)</strong> program, with volunteer advisory mentorship from faculty members of the Department of Computer Science & BCA at Pragjyotish College, Guwahati.
            </p>
            
            <div className="p-4 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Shield className="w-4 h-4 text-blue-700" />
                <span>Affiliation & Governance Note</span>
              </div>
              <p>
                The initiative functions as an autonomous academic technical club and seminar series aligned with student enrichment goals. Sessions are held in college seminar rooms and computer laboratories with department coordinator permissions. It does not speak as the official administrative voice of the college administration unless an explicit written endorsement is published for a specific government-sponsored workshop.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-900 block mb-1">Student Steering Cell</span>
              <p>BCA 3rd and 5th-semester volunteers handling logistics, registrations, audio-visual setups, and documentation.</p>
            </div>
            <div>
              <span className="font-semibold text-slate-900 block mb-1">Faculty Advisory</span>
              <p>Senior educators overseeing curriculum relevance, resource person vetting, and ethical student conduct.</p>
            </div>
            <div>
              <span className="font-semibold text-slate-900 block mb-1">Industry Liaisons</span>
              <p>Tech professionals providing technical guidelines, code reviews, and guest lecture talks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-bold">Have an idea or want to speak?</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Whether you are an industry engineer wanting to conduct a workshop or a student seeking seminar resources, get in touch with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Shantipur, Guwahati, Assam 781009</span>
              </span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>bca.techtalks@pragjyotishcollege.ac.in</span>
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 rounded-md transition-colors shadow-xs"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
