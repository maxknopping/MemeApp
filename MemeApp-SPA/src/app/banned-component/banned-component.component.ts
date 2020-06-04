import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-banned-component',
  templateUrl: './banned-component.component.html',
  styleUrls: ['./banned-component.component.css']
})
export class BannedComponentComponent implements OnInit {

  constructor(private auth: AuthService) { }

  banEnds = this.auth.currentUser.banEnds;

  ngOnInit() {
    
  }

}
