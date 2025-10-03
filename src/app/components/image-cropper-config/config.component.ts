import { Component } from '@angular/core';
import { ImageService } from '../services/image.service';
import { CropConfig } from '../../models/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  standalone: true
})
export class ConfigComponent {
  config: CropConfig = {
    logo_position: 'bottom-right',
    scale_down: 0.25
  };

  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  existingLogoUrl: string | null = null;
  isLoading = false;
  
  
  savedConfigs: CropConfig[] = [];
  selectedConfigId: number | null = null;
  showConfigList = false;
  maxConfigs = 3; 

  positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'center', label: 'Center' }
  ];

  constructor(private imageService: ImageService) {
    this.loadAllConfigs();
  }

  loadAllConfigs(): void {
    this.isLoading = true;
    this.imageService.getAllConfigs().subscribe({
      next: (configs: any) => {
        this.savedConfigs = configs;
        
        if (configs.length > 0) {
          this.loadConfigById(configs[0].id!);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading configurations:', error);
        alert('Error loading configurations');
        this.isLoading = false;
      }
    });
  }

 loadConfigById(configId: number): void {
  const selectedConfig = this.savedConfigs.find(c => c.id === configId);
  if (selectedConfig) {
    this.config = { ...selectedConfig };
    this.selectedConfigId = configId;
    
    
    this.existingLogoUrl = selectedConfig.logo_image || null;
    
    
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;
  }
}

  
  hasLogo(config: CropConfig): boolean {
    return !!(config.logo_image && config.logo_image.trim());
  }

  onLogoFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo image must be smaller than 2MB');
        return;
      }

      this.selectedLogoFile = file;
      
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoPreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file for the logo');
    }
  }

  saveConfig(): void {
    this.isLoading = true;

  
    if (this.selectedLogoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.submitConfig(reader.result as string);
      };
      reader.readAsDataURL(this.selectedLogoFile);
    } else {
      
      this.submitConfig(this.existingLogoUrl || undefined);
    }
  }

  private submitConfig(logoImage: string | undefined): void {
    const configWithLogo: CropConfig = {
      ...this.config,
      logo_image: logoImage 
    };

   
    if (this.selectedConfigId) {
      configWithLogo.id = this.selectedConfigId;
    }

    this.imageService.saveConfig(configWithLogo).subscribe({
      next: (response: any) => {
        console.log('Saved config:', response);
        const action = this.selectedConfigId ? 'updated' : 'created';
        alert(`Configuration ${action} successfully!`);
        this.loadAllConfigs();
        this.selectedLogoFile = null;
        this.logoPreviewUrl = null;
        this.isLoading = false;
        
        
        this.imageService.notifyConfigChanged();
      },
      error: (error: any) => {
        console.error('Save error:', error);
        alert('Error saving configuration');
        this.isLoading = false;
      }
    });
  }

  deleteConfig(configId: number): void {
    if (confirm('Are you sure you want to delete this configuration?')) {
      this.isLoading = true;
      this.imageService.deleteConfig(configId).subscribe({
        next: () => {
          alert('Configuration deleted successfully!');
          if (this.selectedConfigId === configId) {
            this.selectedConfigId = null;
          }
          this.loadAllConfigs();
          
          
          this.imageService.notifyConfigChanged();
        },
        error: (error: any) => {
          console.error('Delete error:', error);
          alert('Error deleting configuration');
          this.isLoading = false;
        }
      });
    }
  }

  createNewConfig(): void {
    if (this.savedConfigs.length >= this.maxConfigs) {
      alert(`Maximum ${this.maxConfigs} configurations allowed. Please delete an existing configuration first.`);
      return;
    }

    this.config = {
      logo_position: 'bottom-right',
      scale_down: 0.25
    };
    this.selectedConfigId = null;
    this.existingLogoUrl = null;
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;
  }

  toggleConfigList(): void {
    this.showConfigList = !this.showConfigList;
  }

  removeLogoPreview(): void {
    this.selectedLogoFile = null;
    this.logoPreviewUrl = null;
  }

  removeExistingLogo(): void {
    this.existingLogoUrl = null;
    this.config.logo_image = undefined; 
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString() + ' ' + 
             new Date(dateString).toLocaleTimeString();
    } catch {
      return 'Invalid Date';
    }
  }

  getPositionLabel(position: string): string {
    const pos = this.positions.find(p => p.value === position);
    return pos ? pos.label : position;
  }

  canCreateNew(): boolean {
    return this.savedConfigs.length < this.maxConfigs;
  }

  getRemainingSlots(): number {
    return Math.max(0, this.maxConfigs - this.savedConfigs.length);
  }
}
