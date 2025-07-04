export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired';

export type KycStatus = 'unverified' | 'basic' | 'pending_review' | 'verified' | 'rejected' | 'suspended' | 'expired';

export type VerificationType =
  | 'national_id'
  | 'passport'
  | 'driving_license'
  | 'address'
  | 'selfie';

export interface UserVerification {
  id: string;
  userId: string;
  verificationType: VerificationType;
  documentNumber?: string;
  documentImageUrl?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  // Address fields (optional)
  addressLine?: string;
  city?: string;
  district?: string;
  country?: string;
  // OCR extracted fields (optional)
  ocrData?: Record<string, any>;
  // Selfie/liveness fields (optional)
  selfieImageUrl?: string;
  livenessScore?: number;
  // AI profile verification score (optional)
  aiProfileScore?: number;
}

export interface SubmitVerificationRequest {
  verificationType: VerificationType;
  documentNumber?: string;
  documentImageUrl?: string;
  // Address fields (for address verification)
  addressLine?: string;
  city?: string;
  district?: string;
  country?: string;
  // Selfie
  selfieImageUrl?: string;
}

export interface ReviewVerificationRequest {
  verificationId: string;
  status: VerificationStatus;
  notes?: string;
}
