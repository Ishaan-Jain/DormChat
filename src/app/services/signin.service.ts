import { Injectable } from '@angular/core';
import {io} from 'socket.io-client'
import {Observable,Observer} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  newUser : string = ""
  socket !: any;
  room : string = "";

  constructor() { }

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
    this.socket.emit('room',[room,user]);
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

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
  


}
