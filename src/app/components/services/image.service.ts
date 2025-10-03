import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CropConfig, CropParams } from './../../models/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl = environment.apiUrl;
  
  private configChangedSubject = new Subject<void>();
  public configChanged$ = this.configChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  getConfig(): Observable<CropConfig> {
    return this.http.get<CropConfig>(`${this.apiUrl}/config`);
  }

  getAllConfigs(): Observable<CropConfig[]> {
    return this.http.get<CropConfig[]>(`${this.apiUrl}/configs`);
  }

  saveConfig(config: CropConfig): Observable<any> {
    return this.http.post(`${this.apiUrl}/config`, config);
  }

  deleteConfig(configId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/config/${configId}`);
  }

  notifyConfigChanged(): void {
    this.configChangedSubject.next();
  }

  cropImage(imageFile: File, cropParams: CropParams, configId?: number | null): Observable<Blob> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('x', cropParams.x.toString());
    formData.append('y', cropParams.y.toString());
    formData.append('width', cropParams.width.toString());
    formData.append('height', cropParams.height.toString());
    
    if (configId !== null && configId !== undefined) {
      formData.append('configId', configId.toString());
    }

    return this.http.post(`${this.apiUrl}/crop`, formData, { 
      responseType: 'blob' 
    });
  }
}