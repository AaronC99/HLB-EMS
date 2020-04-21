import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss']
})
export class ApprovalPageComponent implements OnInit {
  currUserDomainId:string;
  period: string;
  year:string;
  constructor(
    private route:ActivatedRoute
  ) {
    this.currUserDomainId = this.route.snapshot.paramMap.get('domainId');
    this.period = this.route.snapshot.paramMap.get('period');
    this.year = this.route.snapshot.paramMap.get('year');
   }

  ngOnInit(): void {
  }

}
