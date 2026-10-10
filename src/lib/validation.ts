export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  // Indian 10-digit phone format or standard international
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

export function validateRegistrationForm(data: {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  semester: string;
  rollNumber: string;
  consentAccepted: boolean;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.fullName.trim() || data.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 3 characters long.' });
  }

  if (!data.email.trim() || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid academic or personal email address.' });
  }

  if (!data.phone.trim() || !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid 10-digit mobile number for event notifications.' });
  }

  if (!data.institution.trim()) {
    errors.push({ field: 'institution', message: 'College/Institution name is required.' });
  }

  if (!data.course.trim()) {
    errors.push({ field: 'course', message: 'Course program (e.g., BCA, B.Sc CS) is required.' });
  }

  if (!data.semester.trim()) {
    errors.push({ field: 'semester', message: 'Semester selection is required.' });
  }

  if (!data.consentAccepted) {
    errors.push({ field: 'consentAccepted', message: 'You must confirm event attendance guidelines to register.' });
  }

  return errors;
}

export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Please provide your full name.' });
  }

  if (!data.email.trim() || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!data.subject.trim() || data.subject.trim().length < 4) {
    errors.push({ field: 'subject', message: 'Subject must be at least 4 characters.' });
  }

  if (!data.message.trim() || data.message.trim().length < 15) {
    errors.push({ field: 'message', message: 'Message must be at least 15 characters long.' });
  }

  return errors;
}
