import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthBarComponent {
  @Input() logoutReturnTo: string = window.location.origin;
  constructor(public auth: AuthService) {}
}