import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FeatherModule} from 'angular-feather';
import {Home, Star, PlusCircle, Search, MessageCircle, Bell, User, Square, X} from 'angular-feather/icons';


@NgModule({
  declarations: [],
  imports: [
    FeatherModule.pick({Home, Star, PlusCircle, Search, MessageCircle, Bell, User, Square, X})
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
