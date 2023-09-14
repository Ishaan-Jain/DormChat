import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SigninService } from 'src/app/services/signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  username: string = "";
  room: string = ""
  

  constructor(private router: Router, private userService: SigninService){}



 submit(){
    this.userService.setUser(this.username)
    this.userService.setRoom(this.room)
    if(this.room === "1-on-1"){
      if(this.userService.roomFull()){
        alert("Room full choose different room or wait for room to be empty.");
      }
      else{
        this.router.navigate(['chat']);
      }
    }
    else{
      this.router.navigate(['chat']);
    }
    
  }

}
