import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InitializeService } from '../../initialize/initialize.service';
import { toResponse } from '../query-builder/interfaces/response.interface';

@Injectable()
export class InitializationMiddleware implements NestMiddleware {
  constructor(private readonly initializeService: InitializeService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isInitialized = await this.initializeService.isInitialized();

    if (!isInitialized) {
      const errorResponse = toResponse(null, undefined, undefined, undefined, [
        {
          status: '503',
          code: 'SYSTEM_NOT_INITIALIZED',
          title: 'Service Unavailable',
          detail: 'System is not initialized. Please configure settings first.',
        },
      ]);

      return res.status(503).json(errorResponse);
    }

    next();
  }
}
