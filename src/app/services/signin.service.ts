import { Injectable } from '@angular/core';
import {io} from 'socket.io-client'
import {Observable,Observer} from 'rxjs'
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  newUser : string = ""
  socket !: any;
  room : string = "";
  msg : any = []

  apiUrl = "http://localhost:5000/chat";
  isfull: boolean = false;



  constructor(private http: HttpClient) { }

  getMessagesfromDatabase(): Observable<any>{
    return this.http.get(this.apiUrl)
  }

  sendMessagetoDatabse(Obj: any): Observable<any>{
    return this.http.post(this.apiUrl,Obj,httpOptions);
  }

  setUser(user: string){
    this.newUser = user;
  }

  setRoom(room: string){
    this.room = room;
  }

  getRoom(){
    return this.room;
  }

  getUser(){
    return this.newUser
  }

  setUpConnection(room: string, user: string){
    this.socket = io('http://localhost:5000');
    return this.socket.emit('room',[room,user]);
  }

  getMessages(){
    return  new Observable((observer: Observer<any>)=>{
      this.socket.on('message', (message:any)=>{
        if(message === "Full"){
          this.isfull = true;
        }
        else{
          observer.next(message);
        }
        
      })
    })
  }

  roomFull(){
    if(this.isfull){
      return true
    }

    return false

  }

  getUsers(){
    return  new Observable((observer: Observer<any>)=>{
      this.socket.on('users', (users:any)=>{
        observer.next(users);
      })
    })

  }

  sendMsg(Obj:any){
    this.socket.emit('message',Obj);
  }

  resetMessages(room: string){
    this.socket.emit('before disconnect',room)
  }


  // privateMsg(Obj:any):any{
  //   this.socket.emit('private message',(Obj.toId))
  //   this.socket.on('private message',(msgs:any) =>{
  //      this.msg = msgs;
  //   })
  // }

  // getM(){
  //   return this.msg
  // }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
  


}
