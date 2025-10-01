import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class ImageService {
      private apiUrl = 'http://localhost:5001/api';

        constructor(private http: HttpClient) {}
        // Service methods logic

         uploadForPreview() {
            // Upload for preview logic
         }
         generateFinalImage() {
            // Generate final image logic
            }
         getAllConfigs() {
            // Get all configurations logic
         }

         createConfig() {   
            // Create configuration logic
         }
         
         getConfigById() {
               // Get configuration by ID logic
            }

        }