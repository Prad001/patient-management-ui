import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { firstValueFrom, scheduled, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Router } from '@angular/router';
import { ScheduleCreateOrUpdateComponent } from './schedule-create-or-update/schedule-create-or-update.component';
import { MatDialog } from '@angular/material/dialog';
import { Availabilities } from 'src/types/availabilities';
import { ScheduleService } from './schedule.service';
import { AvailabilityUpdateDialogComponent } from './availability/availability-update-dialog/availability-update-dialog.component';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#32CD32',
    secondary: '#93f093ff',
  }
};

@Component({
  selector: 'app-schedule',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  @ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  scheduleData:Availabilities[]=[];
  tempDoctorId:string = 'dd01866f-cbc8-4ad3-ad46-1c778c352122';

  modalData?: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      // onClick: ({ event }: { event: CalendarEvent }): void => {
      //   this.handleEvent('Edited', event);
      // },
      onClick:({ event }: { event: CalendarEvent }): void => {
          this.openAvailabilityDialog(event.id);
      }
    },
    // {
    //   label: '<i class="fas fa-fw fa-trash-alt"></i>',
    //   a11yLabel: 'Delete',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   },
    // },
  ];

  openAvailabilityDialog(id:any){

     this.dialog
      .open(AvailabilityUpdateDialogComponent, {
        width: '950px',
        height: '700px',
        data: { availabilityId: id },
      })
      .afterClosed()
      .subscribe(() => {
        this.router.navigate(['doctor/schedule']);
      });

  }

  refresh = new Subject<void>();

  events: CalendarEvent[] = [

  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private router: Router, private dialog:MatDialog, private scheduleService:ScheduleService) {}


    ngOnInit(): void {
      this.fetchAvailabilities();
    }

    

async fetchAvailabilities() {
  const response = await firstValueFrom(
    this.scheduleService.getAvailabilities(this.tempDoctorId)
  );

  this.scheduleData = response;

  this.events = this.scheduleData.map((item) => {
    const start = new Date(`${item.date}T${item.startTime}`);
    const end = new Date(`${item.date}T${item.endTime}`);

    return {
      id: item.availabilityId,
      title: item.slotName,
      start,
      end,
      color: item.availability ? colors['green'] : colors['red'],
      actions: this.actions,
      allDay: false,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      meta: item,
    } as CalendarEvent;
  });

  this.refresh.next(); // trigger change detection for calendar
}


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  createSchedule() {
    this.dialog
      .open(ScheduleCreateOrUpdateComponent, {
        width: '950px',
        height: '700px',
        data: { isCreateMode:true, title: 'Schedule' },
      })
      .afterClosed()
      .subscribe(() => {
        this.router.navigate(['doctor/schedule']);
      });
  }
}
