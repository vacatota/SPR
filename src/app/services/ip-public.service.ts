import { Injectable } from '@angular/core';  
import { HttpClient, HttpContext  } from '@angular/common/http';  
import { BYPASS_JWT_TOKEN } from '../helpers/jwt.interceptor';
  
@Injectable({  
  providedIn: 'root'  
})  
export class IpPublicService  {  
  
  constructor(private http:HttpClient) { } 
   
  public getIPAddress()  
  {  
    return this.http.get("https://api.ipify.org/?format=json", {context: new HttpContext().set(BYPASS_JWT_TOKEN, true)});  
  }  
}  