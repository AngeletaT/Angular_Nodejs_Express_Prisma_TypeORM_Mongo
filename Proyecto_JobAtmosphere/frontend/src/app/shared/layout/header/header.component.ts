import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '../../../core/services/jwt.service';
import { UserService } from '../../../core/services/user.service';
import { CompanyService } from '../../../core/services/company.service';
import { RecruiterService } from '../../../core/services/recruiter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userType: string | null = null;
  userImage: string | null = null;
  logged = false;

  constructor(
    private router: Router,
    private jwtService: JwtService,
    private userService: UserService,
    private companyService: CompanyService,
    private recruiterService: RecruiterService) { }

  ngOnInit(): void {
    // Obtener el tipo de usuario decodificando el token almacenado
    const token = this.jwtService.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userType = decodedToken?.user?.typeuser || decodedToken?.typeuser;

        this.loadUserData();
        this.logged = true;
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    }
  }

  onProfileClick(): void {
    // Redirigir según el tipo de usuario
    if (this.userType === 'client') {
      this.router.navigate(['/profile']);
    } else if (this.userType === 'company') {
      this.router.navigate(['/company-dashboard']);
    } else if (this.userType === 'recruiter') {
      this.router.navigate(['/recruiter-dashboard']);
    } else {
      // Si no hay un tipo de usuario válido, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.jwtService.destroyToken();
    if (this.userType === 'client') {
      this.userService.logout();
    } else if (this.userType === 'company') {
      this.companyService.logout();
    } else if (this.userType === 'recruiter') {
      this.recruiterService.logout();
    }
    this.router.navigate(['/login']);
    window.location.reload();
  }

  loadUserData(): void {
    if (this.userType === 'client') {
      this.userService.getUserProfile().subscribe({
        next: (user) => {
          // console.log('Datos del cliente:', user);
          this.userImage = user.image;
        },
        error: (err) => {
          console.error('Error al obtener datos del cliente:', err);
        }
      });
    } else if (this.userType === 'company') {
      this.companyService.getCompanyProfile().subscribe(
        data => {
          // console.log('Datos de la empresa:', data);
          this.userImage = data.image ?? null;
        },
        error => {
          console.error('Error al obtener datos de la empresa:', error);
        }
      );
    } else if (this.userType === 'recruiter') {
      this.recruiterService.getRecruiterProfile().subscribe({
        next: (recruiter) => {
          // console.log('Datos del reclutador:', recruiter);
          this.userImage = recruiter.user.image;
        },
        error: (err) => {
          console.error('Error al obtener datos del reclutador:', err);
        }
      });
    }
  }

  isClient(): boolean {
    return this.userType === 'client';
  }
}
