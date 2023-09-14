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
    this.userService.setUser(this.username);
    this.userService.setRoom(this.room);
    this.router.navigate(['chat']);
    this.room = ""
  }
}