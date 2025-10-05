export interface CropParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropConfig {
  id?: number;
  name: string;
  logo_position: string;
  logo_scale: number;
  logo_image?: string;
  created_at?: string;
  updated_at?: string;
}
