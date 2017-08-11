import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {PlayerService} from '../../services/player.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:Object;
  roster: Array<any>;
  bids: Array<any>;
  showBids:boolean = false;
  payroll:number =0;

  constructor(private authService:AuthService,
              private router:Router,
              private playerService: PlayerService,
              private flashMessage:FlashMessagesService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.callGetRoster();
      this.callGetBids();
    },
    err => {
      console.log(err);
      return false;
    });
  }

  switchView(){
    this.showBids= !this.showBids
  }

  callGetRoster(){this.playerService.getRoster(this.user).subscribe(roster => {
    this.roster = roster;
    this.calculatePayroll();
    },
    err => {
      console.log(err);
      return false;
    });

  }

  callGetBids(){this.playerService.getBids(this.user).subscribe(bids => {
    this.bids = bids;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  calculatePayroll(){
    this.payroll = 0;
    for(var i =0; i< this.roster.length;i++){
      this.payroll += this.roster[i].salary;
    }
    for(var i =0; i< this.bids.length;i++){
      this.payroll += this.bids[i].salaryBid;
    }
    this.payroll=Math.ceil(this.payroll);
    let user = JSON.parse(localStorage.getItem('user'));
    user.money = 100000000-this.payroll;
    localStorage.setItem('user', JSON.stringify(user));
  }

  /*withdrawOffer(id){
    this.playerService.deleteBid(id);
    this.flashMessage.show("Offer withdrawn", {
      cssClass: 'alert-success',
      timeout: 10000});
    this.router.navigate(['/profile']);
    this.roster = null;
  }*/
}
