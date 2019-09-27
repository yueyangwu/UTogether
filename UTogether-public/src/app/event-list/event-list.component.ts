import { Component, OnInit } from '@angular/core';
import { UTogetherDataService } from '../utogether-data.service';

export class Event {
  _id: string;
  name: string;
  distance: number;
  date: string;
  time: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})

export class EventListComponent implements OnInit {

  constructor(private utogetherDataService: UTogetherDataService) { }

  public events: Event[];

  private getEvents(): void {
    this.utogetherDataService
      .getEvents()
        .then(foundEvents => this.events = foundEvents);
  }

  // events: Event[] = [{
  //   _id: '5c60f46e5faadb7651d0653c',
  //   name: 'Introduction to Authentic Chinese Food',
  //   distance: 14.0,
  //   date: '29 October 2019',
  //   time: '1:10pm',
  //   category: 'food',
  //   description: 'We will meet at Family which is an authentic Chinese food restaurant.'
  // }, {
  //   _id: '5c23f2573e04ad86095f33f7',
  //   name: 'Pumpkin Carving Night',
  //   distance: 239.5,
  //   date: '23 October 2019',
  //   time: '5:30pm',
  //   category: 'culture',
  //   description: "Join us Halloween Night! Join PALS for a ghostly night of pumpkin carving! Don't miss out on this treat!"
  // }];

  ngOnInit() {
    this.getEvents();
  }

}
