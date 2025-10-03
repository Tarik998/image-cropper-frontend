/**
 * Core interfaces for the Image Cropper application
 * These interfaces provide type safety and better documentation
 */

export interface CropParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropConfig {
created_at?: string;
  id?: number;
  logo_position: string;
  scale_down: number;
  image_id?: number;
  logo_image?: string; 
}