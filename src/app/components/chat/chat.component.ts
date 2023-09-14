import { AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
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
  time!: any;
  user: string = ""; // Current user
  message: string = "";
  container !: HTMLElement;
  roomDisplay!:string;


  constructor(private userService: SigninService, private router: Router){
    this.user = (userService.getUser());
  }

  ngOnInit(): void {
    this.username = (this.userService.getUser());
    if(!this.username){
      this.ngOnDestroy()
      this.router.navigate(['/'])
    }
    this.room = this.userService.getRoom()
    this.roomDisplay = this.room

    localStorage.setItem("room",this.room)

    window.onbeforeunload = () => {
      console.log("bhjbdjsbjs")
      this.ngOnDestroy()
    }

    // Database
    if(this.room === "Important Info"){
      this.userService.getMessagesfromDatabase().subscribe((messages_database) => {
        this.messages = messages_database;
      })
    }

    // Socket.io
    this.userService.setUpConnection(this.room,this.username);
    // if(this.room === "1-on-1"){
    //   if(this.userService.roomFull()){
    //     alert("Room full choose different room or wait for room to be empty.");
    //     this.router.navigate(['']);
    //   }
    // }
    this.userService.getMessages().subscribe((msgObj) =>{
      if(msgObj === "Full"){
        alert("Room full choose different room or wait for room to be empty.");
        this.router.navigate(['/']);
      }
      this.messages.push(msgObj);
    })
    this.userService.getUsers().subscribe((users: any) =>{
      this.Users = users;
    })

    // window.onbeforeunload = () => {
    //   console.log("bhjbdjsbjs")
    //   this.ngOnDestroy()
    // }

  }

  ngAfterViewChecked(){
    this.container = document.getElementById("msgContainer")!;         
    this.container.scrollTop = this.container.scrollHeight;
  }

  @HostListener('unloaded')
  ngOnDestroy():void{
    if(this.room){
      this.userService.resetMessages(this.room)
    }
    
    
    this.userService.disconnect();
    
  }

  sendMessage(){
    if(this.message){
      console.log(this.room)
      this.userService.sendMsg({room:this.room,user:this.user,message:this.message});
    }
    if(this.room === "Important Info"){
      this.userService.sendMessagetoDatabse({username: this.user, text: this.message}).subscribe((msg) =>{
        console.log(msg)
      })
    }
    this.message=""
    
  }

  // UserClick(user: any){
  //   this.roomDisplay = user.username;
  //   this.room = user.id
  //   this.userService.privateMsg({toId: user.id})
  //   //console.log(this.userService.getM())
  //   this.messages.push(this.userService.getM()[0])
    
    

  // }



}
