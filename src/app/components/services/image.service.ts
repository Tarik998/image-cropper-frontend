import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CropConfig, CropParams } from './../../models/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl = environment.apiUrl; // Simple API URL
  
  private configChangedSubject = new Subject<void>();
  public configChanged$ = this.configChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all configurations
   */
  getAllConfigs(): Observable<{ configs: CropConfig[] }> {
    return this.http.get<{ success: boolean, data: CropConfig[] }>(`${this.apiUrl}/configs`)
      .pipe(map(response => ({
        configs: response.data
      })));
  }

  /**
   * Create new configuration
   */
  createConfig(config: CropConfig): Observable<CropConfig> {
    return this.http.post<{ success: boolean, data: CropConfig }>(`${this.apiUrl}/configs`, config)
      .pipe(map(response => response.data));
  }

  /**
   * Update existing configuration
   */
  updateConfig(id: number, config: CropConfig): Observable<CropConfig> {
    return this.http.put<{ success: boolean, data: CropConfig }>(`${this.apiUrl}/configs/${id}`, config)
      .pipe(map(response => response.data));
  }

  /**
   * Delete configuration
   */
  deleteConfig(configId: number): Observable<any> {
    return this.http.delete<{ success: boolean, data: any }>(`${this.apiUrl}/configs/${configId}`)
      .pipe(map(response => response.data));
  }

  private processImage(imageFile: File, cropParams: CropParams, configId?: number | null, quality: 'preview' | 'high' = 'preview'): Observable<Blob> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('x', cropParams.x.toString());
    formData.append('y', cropParams.y.toString());
    formData.append('width', cropParams.width.toString());
    formData.append('height', cropParams.height.toString());
    formData.append('quality', quality);
    
    if (configId !== null && configId !== undefined) {
      formData.append('configId', configId.toString());
    }

    return this.http.post(`${this.apiUrl}/image/process`, formData, { 
      responseType: 'blob' 
    });
  }

  cropImage(imageFile: File, cropParams: CropParams, configId?: number | null): Observable<Blob> {
    return this.processImage(imageFile, cropParams, configId, 'preview');
  }


  generateImage(imageFile: File, cropParams: CropParams, configId?: number | null): Observable<Blob> {
    return this.processImage(imageFile, cropParams, configId, 'high');
  }


  notifyConfigChanged(): void {
    this.configChangedSubject.next();
  }
}