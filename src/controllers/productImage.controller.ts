import { Request, Response } from 'express';
import ProductImageService from '@/services/productImage.service';
import { ResponseHelper } from '@/utils/response';

class ProductImageController {
  async create(req: Request, res: Response) {
    const result = await ProductImageService.create(req.body);
    if (!result.success) return ResponseHelper.error(res, result.error || 'Failed to add image', 400);
    return ResponseHelper.success(res, 'Image added', result.data, 201);
  }

  async getByProduct(req: Request, res: Response) {
    const { productId } = req.params;
    const result = await ProductImageService.getByProduct(productId);
    if (!result.success) return ResponseHelper.error(res, result.error || 'Failed to fetch images', 400);
    return ResponseHelper.success(res, 'Images retrieved', result.data);
  }

  async setPrimary(req: Request, res: Response) {
    const { imageId, productId } = req.body;
    const result = await ProductImageService.setPrimary(imageId, productId);
    if (!result.success) return ResponseHelper.error(res, result.error || 'Failed to set primary image', 400);
    return ResponseHelper.success(res, 'Primary image set', result.data);
  }

  async delete(req: Request, res: Response) {
    const { imageId } = req.params;
    const result = await ProductImageService.delete(imageId);
    if (!result.success) return ResponseHelper.error(res, result.error || 'Failed to delete image', 400);
    return ResponseHelper.success(res, 'Image deleted');
  }
}

export default new ProductImageController();
