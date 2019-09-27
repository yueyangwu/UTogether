import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { EventListComponent } from './event-list/event-list.component';
import { DistancePipe } from './distance.pipe';

@NgModule({
  declarations: [
    EventListComponent,
    DistancePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [EventListComponent]
})
export class AppModule { }
