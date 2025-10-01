import { Component } from "@angular/core";
import { ImageService } from "../services/image.service";

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
 configs: any[] = [];
  currentConfig: any = {};
  selectedConfigId: number | null = null;


get selectedConfig() {
        return 'default';
  }

  constructor(private imageService: ImageService) {}

   ngOnInit() {
    // Initialization logic
  }

   loadConfigs() {
    // Load configurations logic
  }

  selectConfigById() {
    // Select configuration by ID logic
  }

  resetSelectedConfig() {
    // Reset selected configuration logic
  }

  saveConfig() {
    // Save configuration logic
  }

  resetForm() {
    // Reset form logic
  }

}