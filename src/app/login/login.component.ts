import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  private user: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  fetchUser(usermail: any) {
    return this.dataService.getUser(usermail).subscribe((data: any) => {
      this.user = data;
    });
  }

  onLogin(e: Event, loginForm: any) {
    e.preventDefault();

    const formData: any = Object.keys(loginForm.value).filter((key) => loginForm.value[key]);
    if (formData.length === 0 || formData.length !== 2) {
      window.alert('Fill in all the required details');
    }
    else {
      this.dataService.getUser(loginForm.value.usermail).subscribe((data: any) => {
        if (loginForm.value.usermail === data.id.toString() && loginForm.value.userpwd === data.password) {
          window.location.href = '/administration';
        }
        else { window.alert('Login Failed, either Username or Password is wrong'); }
      });
    }
  }

}
