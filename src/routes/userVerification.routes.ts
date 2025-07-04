import { Router } from 'express';
import UserVerificationController from '@/controllers/userVerification.controller';
import { requireAuth, requireAdmin } from '@/middleware/auth.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     VerificationStatus:
 *       type: string
 *       enum: [unverified, pending, verified, rejected, expired]
 *     VerificationType:
 *       type: string
 *       enum: [national_id, passport, driving_license, address, selfie]
 *     UserVerification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         verificationType:
 *           $ref: '#/components/schemas/VerificationType'
 *         documentNumber:
 *           type: string
 *         documentImageUrl:
 *           type: string
 *         verificationStatus:
 *           $ref: '#/components/schemas/VerificationStatus'
 *         verifiedBy:
 *           type: string
 *         verifiedAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         addressLine:
 *           type: string
 *         city:
 *           type: string
 *         district:
 *           type: string
 *         country:
 *           type: string
 *         selfieImageUrl:
 *           type: string
 *         livenessScore:
 *           type: number
 *         aiProfileScore:
 *           type: number
 *     SubmitVerificationRequest:
 *       type: object
 *       required:
 *         - verificationType
 *       properties:
 *         verificationType:
 *           $ref: '#/components/schemas/VerificationType'
 *         documentNumber:
 *           type: string
 *         documentImageUrl:
 *           type: string
 *         addressLine:
 *           type: string
 *         city:
 *           type: string
 *         district:
 *           type: string
 *         country:
 *           type: string
 *         selfieImageUrl:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Access token required"
 *     ForbiddenError:
 *       description: Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Insufficient permissions"
 * tags:
 *   - name: User Verification
 *     description: User identity verification and KYC operations
 */

const router = Router();

/**
 * @swagger
 * /api/v1/user-verification/submit-documents:
 *   post:
 *     summary: Submit documents for verification
 *     tags: [User Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitVerificationRequest'
 *     responses:
 *       200:
 *         description: Documents submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documents submitted for verification"
 *                 data:
 *                   $ref: '#/components/schemas/UserVerification'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 */
router.post('/submit-documents', requireAuth, UserVerificationController.submitDocuments);

/**
 * @swagger
 * /api/v1/user-verification/status:
 *   get:
 *     summary: Get user verification status
 *     tags: [User Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verification status retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     overall_status:
 *                       $ref: '#/components/schemas/VerificationStatus'
 *                     kyc_status:
 *                       type: string
 *                     verification_types:
 *                       type: object
 *                     pending_count:
 *                       type: number
 *                     verified_count:
 *                       type: number
 *                     rejected_count:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/status', requireAuth, UserVerificationController.getVerificationStatus);

/**
 * @swagger
 * /api/v1/user-verification/resubmit:
 *   put:
 *     summary: Resubmit verification documents
 *     tags: [User Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 required:
 *                   - verificationId
 *                 properties:
 *                   verificationId:
 *                     type: string
 *               - $ref: '#/components/schemas/SubmitVerificationRequest'
 *     responses:
 *       200:
 *         description: Documents resubmitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documents resubmitted for verification"
 *                 data:
 *                   $ref: '#/components/schemas/UserVerification'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Verification not found
 */
router.put('/resubmit', requireAuth, UserVerificationController.resubmitVerification);

/**
 * @swagger
 * /api/v1/user-verification/documents:
 *   get:
 *     summary: Get user verification documents
 *     tags: [User Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verification documents retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       verification_type:
 *                         $ref: '#/components/schemas/VerificationType'
 *                       document_number:
 *                         type: string
 *                       document_image_url:
 *                         type: string
 *                       selfie_image_url:
 *                         type: string
 *                       verification_status:
 *                         $ref: '#/components/schemas/VerificationStatus'
 *                       submitted_at:
 *                         type: string
 *                         format: date-time
 *                       ai_profile_score:
 *                         type: number
 *                       liveness_score:
 *                         type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/documents', requireAuth, UserVerificationController.getVerificationDocuments);

/**
 * @swagger
 * /api/v1/user-verification/history:
 *   get:
 *     summary: Get user verification history
 *     tags: [User Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verification history retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       verification_type:
 *                         $ref: '#/components/schemas/VerificationType'
 *                       verification_status:
 *                         $ref: '#/components/schemas/VerificationStatus'
 *                       submitted_at:
 *                         type: string
 *                         format: date-time
 *                       verified_at:
 *                         type: string
 *                         format: date-time
 *                       verified_by:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       document_number:
 *                         type: string
 *                         description: "Masked document number for privacy"
 *                       ai_profile_score:
 *                         type: number
 *                       liveness_score:
 *                         type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/history', requireAuth, UserVerificationController.getVerificationHistory);

// Legacy endpoints (for backwards compatibility)
router.post('/user-verification', requireAuth, UserVerificationController.submitVerification);
router.get('/user-verification', requireAuth, UserVerificationController.getUserVerifications);

// Admin endpoints
router.post('/user-verification/review', requireAuth, requireAdmin, UserVerificationController.reviewVerification);

export default router;
