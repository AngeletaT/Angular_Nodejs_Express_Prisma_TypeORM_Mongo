import { Component, OnInit } from '@angular/core';
import { JwtService } from '../app/core/services/jwt.service';
import { UserService } from '../app/core/services/user.service';
import { CompanyService } from '../app/core/services/company.service';
import { RecruiterService } from '../app/core/services/recruiter.service';
import { UserTypeService } from '../app/core/services/user-type.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private companyService: CompanyService,
    private recruiterService: RecruiterService,
    private userTypeService: UserTypeService
  ) { }

  ngOnInit() {
    try {
      // Obtener el token del localStorage
      const token = this.jwtService.getToken();
      // console.log('Token:', token);

      if (token) {
        try {
          // Decodificar el token
          const decodedToken: any = jwtDecode(token);
          const userType = decodedToken?.user?.typeuser || decodedToken?.typeuser;
          // console.log('Decoded Token:', decodedToken);
          // console.log('User Type:', userType);

          // Establecer el tipo de usuario en el UserTypeService
          this.userTypeService.setUserType(userType);

          // Llamar al populate correspondiente según el rol del usuario
          if (userType === 'client') {
            // console.log('Llamando a UserService.populate()');
            this.userService.populate();
          } else if (userType === 'company') {
            // console.log('Llamando a CompanyService.populate()');
            this.companyService.populate();
          } else if (userType === 'recruiter') {
            // console.log('Llamando a RecruiterService.populate()');
            this.recruiterService.populate();
          }
        } catch (error) {
          console.error('Error decodificando el token:', error);
        }
      } else {
        // console.log('No hay token');
        this.userService.purgeAuth();
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }
}
