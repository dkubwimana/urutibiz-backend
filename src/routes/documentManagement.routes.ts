import { Router } from 'express';
import DocumentManagementController from '@/controllers/documentManagement.controller';
import { requireAuth, requireAdmin } from '@/middleware/auth.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     DocumentUpload:
 *       type: object
 *       required:
 *         - documentType
 *         - fileName
 *         - fileUrl
 *       properties:
 *         documentType:
 *           type: string
 *           enum: [national_id, passport, driving_license, address_proof, selfie, other]
 *         fileName:
 *           type: string
 *         fileUrl:
 *           type: string
 *         fileSize:
 *           type: number
 *         mimeType:
 *           type: string
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         documentType:
 *           type: string
 *         fileName:
 *           type: string
 *         fileUrl:
 *           type: string
 *         fileSize:
 *           type: number
 *         mimeType:
 *           type: string
 *         uploadStatus:
 *           type: string
 *           enum: [uploaded, processing, verified, rejected, expired]
 *         reviewedBy:
 *           type: string
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UpdateDocumentStatus:
 *       type: object
 *       required:
 *         - uploadStatus
 *       properties:
 *         uploadStatus:
 *           type: string
 *           enum: [uploaded, processing, verified, rejected, expired]
 *         notes:
 *           type: string
 * tags:
 *   - name: Document Management
 *     description: Document upload and management operations
 */

const router = Router();

/**
 * @swagger
 * /api/v1/documents/upload:
 *   post:
 *     summary: Upload a document
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentUpload'
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Missing required fields
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/upload', requireAuth, DocumentManagementController.uploadDocument);

/**
 * @swagger
 * /api/v1/documents:
 *   get:
 *     summary: Get user documents
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *           enum: [national_id, passport, driving_license, address_proof, selfie, other]
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', requireAuth, DocumentManagementController.getUserDocuments);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       404:
 *         description: Document not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     summary: Delete document
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/:id', requireAuth, DocumentManagementController.getDocument);
router.delete('/:id', requireAuth, DocumentManagementController.deleteDocument);

/**
 * @swagger
 * /api/v1/documents/admin/list:
 *   get:
 *     summary: Admin - List all documents with filters
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *       - in: query
 *         name: uploadStatus
 *         schema:
 *           type: string
 *           enum: [uploaded, processing, verified, rejected, expired]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/admin/list', requireAuth, requireAdmin, DocumentManagementController.adminListDocuments);

/**
 * @swagger
 * /api/v1/documents/admin/{id}:
 *   get:
 *     summary: Admin - Get document by ID
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       404:
 *         description: Document not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/admin/:id', requireAuth, requireAdmin, DocumentManagementController.adminGetDocument);

/**
 * @swagger
 * /api/v1/documents/admin/{id}/status:
 *   put:
 *     summary: Admin - Update document status
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDocumentStatus'
 *     responses:
 *       200:
 *         description: Document status updated successfully
 *       400:
 *         description: Invalid upload status
 *       404:
 *         description: Document not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put('/admin/:id/status', requireAuth, requireAdmin, DocumentManagementController.adminUpdateDocumentStatus);

/**
 * @swagger
 * /api/v1/documents/stats:
 *   get:
 *     summary: Get document statistics
 *     tags: [Document Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Document statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     statusBreakdown:
 *                       type: object
 *                     typeBreakdown:
 *                       type: object
 *                     recentUploads:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/stats', requireAuth, requireAdmin, DocumentManagementController.getDocumentStats);

export default router;
