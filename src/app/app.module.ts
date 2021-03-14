import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FindparkingspaceComponent } from './findparkingspace/findparkingspace.component';
import { LoginComponent } from './login/login.component';
import { AdministrationComponent } from './administration/administration.component';
import { RegularuserComponent } from './regularuser/regularuser.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomeComponent } from './home/home.component';
import { ParkingSlotsService } from './parking-slots.service'

@NgModule({
  declarations: [
    AppComponent,
    FindparkingspaceComponent,
    LoginComponent,
    AdministrationComponent,
    RegularuserComponent,
    PagenotfoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ParkingSlotsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
