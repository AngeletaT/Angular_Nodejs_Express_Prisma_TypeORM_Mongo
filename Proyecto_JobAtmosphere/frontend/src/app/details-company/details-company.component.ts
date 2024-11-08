import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Job } from '../core/models/job.model';
import { JobService } from '../core/services/job.service';
import { Company } from '../core/models/company.model';
import { CompanyService } from '../core/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../core/models/comment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-company',
  templateUrl: './details-company.component.html',
  styleUrls: ['./details-company.component.css'],
})
export class DetailsCompanyComponent implements OnInit {
  job!: Job;
  company!: Company;
  name!: string | null;
  selectedComment: Comment | null = null;
  isFollowing: boolean = false; // Nueva propiedad

  constructor(
    private JobService: JobService,
    private CompanyService: CompanyService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // console.log("This is the company name", this.ActivatedRoute.snapshot.paramMap.get('name'));
    this.name = this.ActivatedRoute.snapshot.paramMap.get('name');
    if (this.name) {
      const companyName = this.convertUrlToCompanyName(this.name);
      // console.log("Company Name", companyName);
      this.getCompany(companyName);
    }
  }

  getCompany(companyName: string) {
    this.CompanyService.getCompanyByName(companyName).subscribe(
      (data: any) => {
        this.company = data;
        // console.log(this.company);
      },
      (error: any) => {
        console.error('Error fetching company data', error);
        this.router.navigate(['/']);
      }
    );
  }

  convertUrlToCompanyName(url: string): string {
    return url.replace(/-/g, ' ');
  }

  onToggleFollow() {
    const companyId = this.company.id;
    this.CompanyService.follow(companyId).subscribe(
      (data: any) => {
        this.isFollowing = !this.isFollowing;
      },
      (error: any) => {
        console.error('Error following company', error);
      }
    );
  }

}
