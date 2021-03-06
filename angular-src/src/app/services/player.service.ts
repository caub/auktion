import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PlayerService {
  isDev:boolean;
  bid: any;
  result: any;

  constructor(private http:Http) {
    this.isDev = false; // Change to false before deployment
 }

  getAllPlayers(){
    let ep = this.prepEndpoint('player/all');
    return this.http.get(ep)
        .map(res => res.json());
  }

  getPlayerByLastName(lastName){
    let ep = this.prepEndpoint('player/lastname/');
    return this.http.get(ep+lastName)
    .map(res => res.json());
  }

  getPlayerByFullName(lastName, firstName){
    let ep = this.prepEndpoint('player/name/');
    return this.http.get(ep+lastName+"/"+firstName)
    .map(res => res.json());
  }

  getPlayerByTeam(team){
    let ep = this.prepEndpoint('player/team/');
    return this.http.get(ep+team)
    .map(res => res.json());
  }

  getRoster(user){
    let ep = this.prepEndpoint('player/team/');
    return this.http.get(ep+user.team)
    .map(res => res.json());
  }

  getFreeAgents(){
    let ep = this.prepEndpoint('player/freeagents');
    return this.http.get(ep)
        .map(res => res.json());
  }

  placeBid(player){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("player/placebid");
    //new bid to current bid
    player.durationBid = player.newDurationBid;
    player.newDurationBid=null;
    player.salaryBid = player.newSalaryBid;
    player.newSalaryBid = null;
    player.timeBid = player.newTimeBid;
    player.newTimeBid = null;
    player.teamBid = player.newTeamBid;
    player.newTeamBid = null;

    this.http.post(ep, player, { headers: headers })
     .map((res) => res.json()).subscribe(res => {
       this.result = res;
       //console.log(this.result);
     });
  }

  getBids(user){
    let ep = this.prepEndpoint('player/bids/team/');
    return this.http.get(ep+user.team).map(res => res.json());
  }

  getWatchlist(user){
    let ep = this.prepEndpoint('player/watchlist/team/');
    return this.http.get(ep+user.team).map(res => res.json());
  }

  updateWatchlist(player, user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("player/watchlist/edit/");


    this.http.post(ep+user.team, player, { headers: headers })
     .map((res) => res.json()).subscribe(res => {
       this.result = res;
     });
  }

  // deleteBid(id){
  //   let ep = this.prepEndpoint("bid/delete/"+id);
  //   this.http.delete(ep)
  //    .map((res) => res.json()).subscribe(res => {
  //      this.result = res;
  //      console.log(this.result);
  //    });
  // }

  prepEndpoint(ep){
    if(!this.isDev){
      return ep;
    } else {
      return 'http://localhost:8080/'+ep;
    }
  }
}
