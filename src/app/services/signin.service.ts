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
  adminKey: string = ""

  //apiUrl = "http://localhost:5000/chat";
  apiUrl = "https://dorm-chat-b3557aeb4f98.herokuapp.com/chat"
  isfull: boolean = false;



  constructor(private http: HttpClient) { }

  getMessagesfromDatabase(): Observable<any>{
    return this.http.get(this.apiUrl + "/" + this.room)
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
    this.socket = io(""); //"http://localhost:5000"
    return this.socket.emit('room',[room,user]);
  }

  getMessages(){
    return  new Observable((observer: Observer<any>)=>{
      this.socket.on('message', (message:any)=>{
        observer.next(message);
        
      })
    })
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

  setAdmin(key: string){
    this.adminKey = key;
  }

  getAdmin(){
    return this.adminKey;
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }


  getAdminKey(): Observable<any>{

    return this.http.get(this.apiUrl + "/get/admin-key")

  }

  


}
