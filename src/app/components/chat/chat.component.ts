import { AfterViewInit, Component, OnInit} from '@angular/core';
import { SigninComponent } from '../signin/signin.component';
import { SigninService } from 'src/app/services/signin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  Users : any[] = [];
  messages: any[] = [];
  username:string = ""; // for displaying who sent the msg
  room: string = "";
  time!: any
  user: string = "" // Current user
  message: string = ""


  constructor(private userService: SigninService, private router: Router){
    this.user = (userService.getUser());
  }

  ngOnInit(): void {
    this.username = (this.userService.getUser());
    if(!this.username){
      this.router.navigate([''])
    }
    this.room = this.userService.getRoom()
    this.userService.setUpConnection(this.room,this.username);
    this.userService.getMessages().subscribe((msgObj) =>{
      this.messages.push(msgObj);
    })
    this.userService.getUsers().subscribe((users: any) =>{
      this.Users = users;
    })

  }

  ngOnDestroy():void{
    this.userService.disconnect();
  }

  sendMessage(){
    if(this.message){
      this.userService.sendMsg({room:this.room,user:this.user,message:this.message});
    }
    this.message=""
    
  }



}
