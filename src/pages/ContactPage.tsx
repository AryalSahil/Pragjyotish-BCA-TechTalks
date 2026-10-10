import React, { useState } from 'react';
import { Mail, MapPin, Phone, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { validateContactForm, ValidationError } from '../lib/validation';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Enquiry',
    message: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateContactForm({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Success simulation
    setSubmitted(true);
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(err => err.field === fieldName)?.message;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
          Communications & Secretariat
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Contact Pragjyotish BCA TechTalks
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Connect with the student organizing committee, faculty advisory mentors, or propose a guest technical workshop for students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900">
              Department & Venue Information
            </h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Physical Address:</strong>
                  Department of Computer Science & BCA<br />
                  Govt. Pragjyotish College, Shantipur<br />
                  Guwahati, Kamrup (Metro), Assam – 781009
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Mail className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Electronic Mail:</strong>
                  <span>bca.techtalks@pragjyotishcollege.ac.in</span><br />
                  <span className="text-slate-400">bca.dept@pragjyotishcollege.ac.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <Phone className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Academic Department Desk:</strong>
                  <span>+91 361 254 4531 (College EPABX)</span><br />
                  <span className="text-slate-400">Operational on working weekdays: 10:00 AM – 04:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-xs text-slate-600 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">For Visiting Speakers & Mentors</h3>
            <p className="leading-relaxed">
              We welcome software architects, open-source contributors, and alumni to conduct guest sessions. Computer Laboratory 1 is equipped with 60 Linux workstations, high-speed networking, and dual HDMI projectors.
            </p>
          </div>

        </div>

        {/* Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Submit an Academic or Workshop Enquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Our student coordinators review incoming messages within 24 to 48 business hours.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-bold text-emerald-900">Message Received</h3>
                <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your enquiry regarding &quot;{formData.subject}&quot; has been routed to the TechTalks steering team.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', category: 'General Enquiry', message: '' });
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kaushik Sarma"
                      className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                        getFieldError('name') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-800 focus:outline-hidden text-slate-900`}
                    />
                    {getFieldError('name') && (
                      <p className="text-[11px] text-rose-600 mt-1">{getFieldError('name')}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                        getFieldError('email') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-800 focus:outline-hidden text-slate-900`}
                    />
                    {getFieldError('email') && (
                      <p className="text-[11px] text-rose-600 mt-1">{getFieldError('email')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-xs font-semibold text-slate-700 mb-1">
                      Enquiry Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-800 focus:outline-hidden"
                    >
                      <option value="General Enquiry">General Session Enquiry</option>
                      <option value="Speaker Proposal">Guest Speaker / Workshop Proposal</option>
                      <option value="Student Volunteer">Student Volunteer Application</option>
                      <option value="Lab & Facilities">Lab & Infrastructure Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject / Topic <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief topic of message"
                      className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                        getFieldError('subject') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-800 focus:outline-hidden text-slate-900`}
                    />
                    {getFieldError('subject') && (
                      <p className="text-[11px] text-rose-600 mt-1">{getFieldError('subject')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                    Message Body <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details on your inquiry or talk outline..."
                    className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                      getFieldError('message') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:ring-2 focus:ring-blue-800 focus:outline-hidden text-slate-900`}
                  />
                  {getFieldError('message') && (
                    <p className="text-[11px] text-rose-600 mt-1">{getFieldError('message')}</p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
