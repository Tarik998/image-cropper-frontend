import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ConfigComponent } from './components/image-cropper-config/config.component';
import { AuthService } from '@auth0/auth0-angular';
import { AuthBarComponent } from "./components/auth/auth.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ImageCropperComponent,
    ConfigComponent,
    AuthBarComponent
],
  templateUrl: 'app.html',
  styleUrls: ['app.css']
})

export class App {
  logoutReturnTo = window.location.origin;
  constructor(public auth: AuthService) {}
}