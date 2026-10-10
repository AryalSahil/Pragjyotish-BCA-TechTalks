import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Laptop,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { useTechTalks } from '../context/TechTalksContext';
import { formatDate } from '../lib/utils';
import { validateRegistrationForm, ValidationError } from '../lib/validation';

export const RegisterPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { getEventById, registerForEvent } = useTechTalks();

  const event = eventId ? getEventById(eventId) : undefined;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: 'Pragjyotish College, Guwahati',
    course: 'BCA (Bachelor of Computer Applications)',
    semester: '3rd Semester',
    rollNumber: '',
    laptopAvailable: 'yes' as 'yes' | 'no',
    experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    expectations: '',
    consentAccepted: false,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    submitted: boolean;
    success?: boolean;
    message?: string;
    reference?: string;
  }>({ submitted: false });

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-slate-900">Session Not Found</h1>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested event registration ID does not match any current session.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Sessions</span>
        </Link>
      </div>
    );
  }

  const isClosed = event.registrationStatus === 'closed' || event.status === 'cancelled' || event.status === 'postponed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateRegistrationForm({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      institution: formData.institution,
      course: formData.course,
      semester: formData.semester,
      rollNumber: formData.rollNumber,
      consentAccepted: formData.consentAccepted,
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit registration to Supabase database / store
      const result = await registerForEvent({
        eventId: event.id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        institution: formData.institution.trim(),
        course: formData.course.trim(),
        semester: formData.semester.trim(),
        rollNumber: formData.rollNumber.trim(),
        laptopAvailable: formData.laptopAvailable,
        experienceLevel: formData.experienceLevel,
        expectations: formData.expectations.trim(),
        consentAccepted: formData.consentAccepted,
      });

      setSubmissionStatus({
        submitted: true,
        success: result.success,
        message: result.message,
        reference: result.reference
      });
    } catch (err: any) {
      setSubmissionStatus({
        submitted: true,
        success: false,
        message: err?.message || 'Failed to submit registration. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(err => err.field === fieldName)?.message;
  };

  if (submissionStatus.submitted && submissionStatus.success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-xs text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            {submissionStatus.message}
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-left text-xs text-slate-700 mb-6 space-y-2">
            {submissionStatus.reference && (
              <div className="flex justify-between border-b border-slate-200 pb-2 bg-blue-50/60 -mx-4 -mt-4 p-3 rounded-t-md">
                <span className="text-blue-900 font-semibold">Registration Reference:</span>
                <span className="font-mono font-bold text-blue-900">{submissionStatus.reference}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Candidate:</span>
              <span className="font-semibold">{formData.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold">{formData.email}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Session:</span>
              <span className="font-semibold">{event.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Venue:</span>
              <span className="font-semibold">{formatDate(event.date)} · {event.venue}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mb-6">
            Please report 15 minutes before the scheduled time with your student ID card.
          </p>

          <div className="flex justify-center gap-3">
            <Link
              to="/events"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors"
            >
              Browse Other Events
            </Link>
            <Link
              to={`/events/${event.slug}`}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Back to Session Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to={`/events/${event.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {event.title}</span>
        </Link>

        {/* Session Summary Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2">
            <span className="text-blue-900 font-semibold">{event.category}</span>
            <span className="tabular-nums">
              Capacity: {event.registeredCount}/{event.capacity} seats filled
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
            Register: {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Closed or Postponed Warning */}
        {isClosed ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-900 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h2 className="text-base font-bold">Registration Not Available</h2>
            <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto">
              Registration for this session is currently closed, full, or postponed. Please look out for future notifications.
            </p>
            <div className="mt-4">
              <Link
                to="/events"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
              >
                Browse Open TechTalks
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Student Participant Enrollment Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Please provide accurate student credentials. A confirmation record will be held for roll call and lab access.
              </p>
            </div>

            {submissionStatus.submitted && !submissionStatus.success && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Registration Error</span>
                  <p>{submissionStatus.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Bhaskar Jyoti Das"
                    className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                      getFieldError('fullName') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900`}
                  />
                  {getFieldError('fullName') && (
                    <p className="text-[11px] text-rose-600 mt-1">{getFieldError('fullName')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    College / Personal Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@pragjyotish.edu.in or gmail"
                    className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                      getFieldError('email') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900`}
                  />
                  {getFieldError('email') && (
                    <p className="text-[11px] text-rose-600 mt-1">{getFieldError('email')}</p>
                  )}
                </div>
              </div>

              {/* Phone & Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (WhatsApp updates) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                      getFieldError('phone') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900`}
                  />
                  {getFieldError('phone') && (
                    <p className="text-[11px] text-rose-600 mt-1">{getFieldError('phone')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="institution" className="block text-xs font-semibold text-slate-700 mb-1">
                    College / Institution <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="institution"
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs rounded-md border ${
                      getFieldError('institution') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900`}
                  />
                  {getFieldError('institution') && (
                    <p className="text-[11px] text-rose-600 mt-1">{getFieldError('institution')}</p>
                  )}
                </div>
              </div>

              {/* Course, Semester & Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="course" className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree Program <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-md border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
                  >
                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                    <option value="B.Sc IT / Allied">B.Sc IT / Allied Computing</option>
                    <option value="Other">Other Undergraduate</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="semester" className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Semester <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-md border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
                  >
                    <option value="1st Semester">1st Semester (Freshers)</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester (Final Year)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rollNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                    College Roll / ID Number
                  </label>
                  <input
                    id="rollNumber"
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. BCA/24/023"
                    className="w-full px-3.5 py-2 text-xs rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
                  />
                </div>
              </div>

              {/* Lab Preferences: Laptop and Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bringing Personal Laptop?
                  </label>
                  <div className="flex items-center gap-4 text-xs text-slate-700 mt-2">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="laptop"
                        value="yes"
                        checked={formData.laptopAvailable === 'yes'}
                        onChange={() => setFormData({ ...formData, laptopAvailable: 'yes' })}
                        className="text-blue-900"
                      />
                      <span>Yes, will bring laptop</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="laptop"
                        value="no"
                        checked={formData.laptopAvailable === 'no'}
                        onChange={() => setFormData({ ...formData, laptopAvailable: 'no' })}
                        className="text-blue-900"
                      />
                      <span>No, using Lab Desktop</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Self-assessed Topic Experience
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800 mt-1"
                  >
                    <option value="beginner">Beginner (New to this topic)</option>
                    <option value="intermediate">Intermediate (Built basic projects)</option>
                    <option value="advanced">Advanced (Proficient / Practicing)</option>
                  </select>
                </div>
              </div>

              {/* Expectations */}
              <div>
                <label htmlFor="expectations" className="block text-xs font-semibold text-slate-700 mb-1">
                  Questions or Learning Goals for the Speaker (Optional)
                </label>
                <textarea
                  id="expectations"
                  rows={3}
                  value={formData.expectations}
                  onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                  placeholder="What specific topic, bug, or architecture question would you like addressed?"
                  className="w-full px-3.5 py-2 text-xs rounded-md border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
                />
              </div>

              {/* Consent and Guidelines Confirmation */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentAccepted}
                    onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-800"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I confirm that I am a college student and will attend the session promptly in Computer Lab / Auditorium Hall. I understand that registration details are collected exclusively for session attendance and academic coordination. <span className="text-rose-600">*</span>
                  </span>
                </label>
                {getFieldError('consentAccepted') && (
                  <p className="text-[11px] text-rose-600 mt-1 ml-6">{getFieldError('consentAccepted')}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Duplicate registrations with same email will be flagged.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying &amp; Enrolling...</span>
                    </>
                  ) : (
                    <span>Submit Registration</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
