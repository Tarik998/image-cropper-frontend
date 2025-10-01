import { Component, signal } from '@angular/core';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ConfigComponent } from './components/image-cropper-config/config.component';

@Component({
  selector: 'app-root',
  imports: [
    ImageCropperComponent,
    ConfigComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
