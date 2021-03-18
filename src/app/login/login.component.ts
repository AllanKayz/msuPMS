import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  private user: any = {};

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    //this.fetchUser('administrator@pmsmail.com');
  }


  fetchUser(usermail: any) {
    return this.dataService.getUser(usermail).subscribe((data: any) => {
      this.user = data;
      console.log(this.user);

      for (let d = 0; d < this.user.length; d++) {
        console.log(this.user[d]['name']);
      }
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
        this.user = data;

        this.user.map((usr: any) => {
          if (loginForm.value.userpwd === usr.password) {
            return window.location.href = '/administration';
          }
          else { return window.alert('Login Failed, Wrong Credentials Used'); }
        });
      });
    }
  }

}
