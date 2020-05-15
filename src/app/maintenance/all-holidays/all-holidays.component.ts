import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { NgbCalendar, NgbDateStruct, NgbDate, NgbDatepicker, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Holiday } from 'src/app/model/Holiday.model';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MaintenanceService } from '../service/maintenance.service';

@Component({
  selector: 'app-all-holidays',
  templateUrl: './all-holidays.component.html',
  styleUrls: ['./all-holidays.component.scss']
})
export class AllHolidaysComponent implements OnInit {
  displayMonths = 6;
  navigation = 'none';
  showWeekNumbers = false;
  outsideDays = 'visible';
  isHoliday:any;
  existingHolidays = [];
  isSelected:any;
  holidayDetails:any = [];
  minDate:any;
  holidayObj:Holiday;
  showDetails = null;
  editable:boolean;
  selectedDate:string;
  
  constructor(
    private adminService: AdminService,
    private calendar: NgbCalendar,
    private router:Router,
    private maintainService: MaintenanceService
  ) {
    this.getAllHolidays();
    this.minDate = {
      day: 1,
      month: this.calendar.getToday().month + 1,
      year: this.calendar.getToday().year
    }
   }  

  ngOnInit(): void {
  }

  public getAllHolidays(){
    this.adminService.viewHolidays().subscribe(data =>{
      this.convertDates(data);
      this.holidayDetails = data;
    });
  }

  public convertDates(dates){
    let holidays:any = dates;
      let getDate = string => (([day,month]) => ({day,month}))(string.split('-'));
      holidays.forEach(element => {
        let day = getDate(element.date).day;
        let month = getDate(element.date).month;
        let year = element.year;
        let date = {
          day: parseInt(day),
          month: parseInt(month),
          year: parseInt(year)
        };
        this.existingHolidays.push(date);
      });
  }

  public existingDates(date:NgbDateStruct){
    this.isSelected = this.existingHolidays
      .find( d=>d.year==date.year && d.month==date.month && d.day==date.day)
      return this.isSelected ? 'classSelected' : 'classNormal';
  }

  public transformDayMonth(value){
    let formattedValue = ("0" + value).slice(-2);
    return formattedValue;
  }

  public onDateSelect(date: NgbDate){
    let year = date.year.toString();
    let day = this.transformDayMonth(date.day);
    let month = this.transformDayMonth(date.month);
    let day_month = `${day}-${month}`;
    this.selectedDate = `${year}-${month}-${day}`;
    let startingDate = `${this.minDate.year}-${this.transformDayMonth(this.minDate.month)}-${this.transformDayMonth(this.minDate.day)}`;

    // Disable edit button if selected holiday is before minimum date
    if(moment(this.selectedDate).isSameOrAfter(startingDate))
      this.editable = true;
    else
      this.editable = false;

    // Display Holiday Info 
    for(let i=0;i<this.holidayDetails.length;i++){
      if(this.holidayDetails[i].date === day_month && this.holidayDetails[i].year === year){
        this.holidayObj = {
          _id: this.holidayDetails[i]._id,
          holiday_name:this.holidayDetails[i].holiday_name,
          holiday_type:this.holidayDetails[i].holiday_type,
          date:this.holidayDetails[i].date,
          year: this.holidayDetails[i].year
        };
        this.showDetails = true;
        break;
       }else{
         this.showDetails = false;
       }
    }
  }

  public editHoliday(){
    this.maintainService.setHolidayToEdit = this.holidayObj;
    this.router.navigateByUrl(`/home/edit-holiday/${this.holidayObj._id}`);
  }

  public deleteHoliday(){
    let message = `${this.holidayObj.holiday_name} on  ${this.holidayObj.date}-${this.holidayObj.year} is Deleted Successfully`;
    this.maintainService.deleteHoliday(this.holidayObj._id).subscribe(res => {
      console.log(res);
      if (res !== null){
        this.maintainService.displayMessage(message,'success');
        this.showDetails = null;
        this.getAllHolidays();
      }
    });
  }
}
