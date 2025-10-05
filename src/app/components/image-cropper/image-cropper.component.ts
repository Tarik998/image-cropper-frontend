import { Component, OnDestroy } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent as NgxImageCropperComponent } from 'ngx-image-cropper';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { ImageService } from '../services/image.service';
import { CropConfig } from '../../models/interfaces';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxImageCropperComponent]
})

export class ImageCropperComponent implements OnDestroy {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedFile: File | null = null;
  finalImageUrl: string | null = null;
  generatedImageBlob: Blob | null = null;
  
  availableConfigs: CropConfig[] = [];
  selectedConfigId: number | null = null;
  
  private configChangedSubscription: Subscription;

  constructor(
    private imageService: ImageService,
    public auth: AuthService
  ) {
    this.loadConfigs();
    
    this.configChangedSubscription = this.imageService.configChanged$.subscribe(() => {
      this.loadConfigs();
    });
  }

  ngOnDestroy(): void {
    if (this.configChangedSubscription) {
      this.configChangedSubscription.unsubscribe();
    }
  }

  loadConfigs() {
    this.imageService.getAllConfigs().subscribe({
      next: (result) => {
        this.availableConfigs = result.configs;
        this.selectedConfigId = null;
      },
      error: (error) => {
        console.error('Error loading configs:', error);
        this.availableConfigs = [];
      }
    });
  }

  onConfigChange() {
    if (this.selectedConfigId !== null) {
      this.auth.isAuthenticated$.subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          alert('Please sign in to access logo configurations.');
          this.selectedConfigId = null;
          return;
        }
        
        this.generatePreview();
      });
    } else {
      this.finalImageUrl = null;
      this.generatedImageBlob = null;
    }
  }

  /**
   * Generate preview with logo overlay (uses /api/image/preview)
   */
  private generatePreview() {
    if (!this.selectedFile || !this.croppedImage || this.selectedConfigId === null) {
      return;
    }

    const cropParams = this.getCropParams();
    
    this.imageService.cropImage(this.selectedFile, cropParams, this.selectedConfigId).subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.finalImageUrl = reader.result as string;
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error('Error generating preview:', error);
        if (error.status === 401) {
          this.selectedConfigId = null;
        }
      }
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.selectedFile = event.target.files[0];
    this.finalImageUrl = null;
    this.generatedImageBlob = null;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
    this.generatedImageBlob = null;

    if (this.selectedConfigId !== null) {
      this.generatePreview();
    }
  }

  generateImage(): void {
    if (!this.selectedFile || !this.croppedImage) {
      alert('Please upload an image and crop it first');
      return;
    }

    const cropParams = this.getCropParams();

    if (this.selectedConfigId !== null) {
      this.auth.isAuthenticated$.subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.selectedConfigId = null;
          return;
        }
        
        this.performCrop(cropParams);
      });
    } else {
      this.performCrop(cropParams);
    }
  }

  private performCrop(cropParams: any): void {
    this.imageService.generateImage(this.selectedFile!, cropParams, this.selectedConfigId).subscribe({
      next: (blob) => {
        this.generatedImageBlob = blob;
        
        const reader = new FileReader();
        reader.onload = () => {
          this.finalImageUrl = reader.result as string;
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error('Error processing image:', error);
        if (error.status === 401) {
          this.selectedConfigId = null;
        } else {
          alert('Error processing image. Please try again.');
        }
      }
    });
  }

  getCropParams() {
    const pos = this.croppedImage.imagePosition;
    return {
      x: Math.round(pos.x1),
      y: Math.round(pos.y1),
      width: Math.round(pos.x2 - pos.x1),
      height: Math.round(pos.y2 - pos.y1)
    };
  }

  getPositionLabel(position: string): string {
    const labels: { [key: string]: string } = {
      'top-left': 'Top Left',
      'top-right': 'Top Right',
      'bottom-left': 'Bottom Left',
      'bottom-right': 'Bottom Right',
      'center': 'Center'
    };
    return labels[position] || position;
  }

  downloadImage(): void {
    if (this.generatedImageBlob) {
      saveAs(this.generatedImageBlob, 'cropped-image.png');
    } else {
      alert('Please generate an image first by clicking "Generate Image"');
    }
  }
}