import { Component, OnInit } from "@angular/core";
import { ImageService } from "../services/image.service";


@Component({
  selector: 'app-image-cropper',
  standalone: true,
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {
     imageFile: File | null = null;
     croppedImage: any = '';
     previewUrl: string | null = null;
    isLoading = false;

    configs: any[] = [];
    selectedConfigId: number | null = null;

      constructor(private imageService: ImageService) {}


    ngOnInit() {
        // Initialization logic
    }

    loadConfigs(selectId?: number) {
        // Load configurations logic
    }

    updatePreview() {
        // Update preview logic
    }

    generateFinal() {
        // Generate final image logic
    }
}