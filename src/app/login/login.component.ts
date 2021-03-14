import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private usermail: any;
  private password: any;

  constructor() { }

  ngOnInit(): void {
  }

  onLogin() {

  }

}
