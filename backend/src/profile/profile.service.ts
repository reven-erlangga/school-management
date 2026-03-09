import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryBuilderService } from '../common/query-builder/query-builder.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    private readonly queryBuilder: QueryBuilderService,
  ) {}

  async getProfile(userId: string) {
    const profiles = await this.queryBuilder
      .using('user', {
        filter: { id: userId },
      })
      .allowedFilters(['id'])
      .execute();

    if (!profiles || profiles.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = profiles[0];
    // Remove password from response
    const { password, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; image?: string }) {
    // Check if user exists
    const user = await this.getProfile(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUsers = await this.queryBuilder
        .using('user', {
          filter: { email: data.email },
        })
        .allowedFilters(['email'])
        .execute();

      if (existingUsers.length > 0) {
        throw new BadRequestException('Email already in use');
      }
    }

    const updatedUser = await this.queryBuilder
      .using('user', {}) // Update by ID directly
      .update(userId, data);

    const { password, ...profile } = updatedUser;
    return profile;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Get user with password
    const profiles = await this.queryBuilder
      .using('user', {
        filter: { id: userId },
      })
      .allowedFilters(['id'])
      .execute();

    if (!profiles || profiles.length === 0) {
      throw new NotFoundException('User not found');
    }
    const user = profiles[0];

    // Verify current password (assuming plain text as per existing AuthService implementation)
    // Note: In a production environment, passwords should be hashed using bcrypt or argon2.
    // If the AuthService is updated to use hashing, this logic must be updated as well.
    if (user.password !== currentPassword) {
      throw new BadRequestException('Invalid current password');
    }

    // Update password
    await this.queryBuilder
      .using('user', {})
      .update(userId, { password: newPassword });

    return { message: 'Password updated successfully' };
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Construct image URL
    const apiUrl = process.env.PUBLIC_API_URL || 'http://localhost:3001';
    // Assuming static file serving is set up for 'uploads' directory
    const imageUrl = `${apiUrl}/uploads/${file.filename}`;

    // Update user profile with image URL
    return this.updateProfile(userId, { image: imageUrl });
  }
}
