import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Holiday } from 'src/app/model/Holiday.model';
import { AdminService } from '../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaintenanceService } from 'src/app/maintenance/service/maintenance.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-holiday-declaration',
  templateUrl: './holiday-declaration.component.html',
  styleUrls: ['./holiday-declaration.component.scss']
})
export class HolidayDeclarationComponent implements OnInit,AfterViewInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  holidayTypes = ['Working','Non-Working'];
  createHolidayForm:FormGroup;
  startDate:any;
  endDate:any;
  holidayDuration = [];
  holiday: Holiday;
  exisitingHolidays = [];
  isDisabled:any;
  minDate:any;
  editDate:any;
  isDuplicate:boolean;
  newRecord:boolean = true;
  holidayId:string;

  constructor(
    private calendar: NgbCalendar,
    private formBuilder:FormBuilder,
    private formatter: NgbDateParserFormatter,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private maintainService: MaintenanceService,
    private route: ActivatedRoute,
    private router: Router
    ) { 
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
    this.setMinDate();
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    this.holidayId = this.route.snapshot.paramMap.get('holidayId');
  }

  ngOnInit(): void {
    this.viewAllHolidays();
    this.createForm();
  }

  ngAfterViewInit(){
    this.checkHolidayForEdit();
  }

  createForm(){
    this.createHolidayForm = this.formBuilder.group({
      holidayName: ['',Validators.required],
      holidayType: ['',Validators.required]
    });
  }

  public setMinDate(){
    this.minDate = {
      year: this.fromDate.year,
      month: this.fromDate.month + 1,
      day: 1
    };
    this.fromDate = this.minDate;
    this.toDate = this.minDate;
  }

  public disableDates(dates){
    this.isDisabled = (date:NgbDateStruct,current: {month:number,year:number}) =>{
      return dates.find(x=>NgbDate.from(x).equals(date))?true:false;
    }
  }

  get userInput(){
    return this.createHolidayForm.controls;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.endDate = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.endDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    }
    this.startDate = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    this.validateHoliday(this.fromDate,this.toDate);
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  public viewAllHolidays(){
    this.adminService.viewHolidays()
      .subscribe(data => {
        let holidays:any = data;
        let getDate = string => (([day,month]) => ({day,month}))(string.split('-'));
        holidays.forEach(element => {
          let day = getDate(element.date).day;
          let month = getDate(element.date).month;
          let year = element.year;
          let holidays ={
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year)
          };
          this.exisitingHolidays.push(holidays);
        });
        this.disableDates(this.exisitingHolidays);
      });
  }

  public validateHoliday(startDay,endDay){
    this.isDuplicate = false;
    let startDate = moment(this.formatter.format(startDay));
    let endDate = moment(this.formatter.format(endDay));
    let duration = [];
    if (endDate.format("DD-MM-YYYY") === 'Invalid date')
      endDate = startDate;

    for(let i=moment(startDate); i.isSameOrBefore(endDate);i.add(1,'days')){
      let date = i.format("DD-MM");
      let year = i.format("YYYY");
      let holiday = {
        date: date,
        year: year
      }
      duration.push(holiday);
    }
    this.adminService.viewHolidays().subscribe ( data => {
      let existingDates:any = data;
      for (let i=0;i<existingDates.length;i++){
        for (let j=0;j<duration.length;j++){
          if (existingDates[i].date === duration[j].date && existingDates[i].year === duration[j].year){
            this.isDuplicate = true;
            break;
          }
        }
      }
    });
  }

  onSubmit(){
    this.holidayDuration.splice(0,this.holidayDuration.length);
    if (this.newRecord){
      // Create new holiday
      this.setHoliday(this.fromDate,this.toDate,null);
      this.adminService.createHoliday(this.holidayDuration).subscribe(
        data =>{
          let holidayArray:any = data;
          holidayArray.forEach(element => {
            if (element !== null)
              this.displayMessage('Holiday Created Successfully','success');
          });
        }
      );
    } else {
      this.setHoliday(this.fromDate,this.toDate,this.holidayId);
      // Update edited holiday
      this.maintainService.editHoliday(this.holiday).subscribe( result =>{
        if (result !== null)
          this.displayMessage(`Holiday \'${this.holiday.holiday_name}\'Edited Successfully`,'success');
      });
    }
    this.createHolidayForm.reset();
    this.router.navigateByUrl('/home/all-holiday');
  }

  public setHoliday(fromDate,toDate,id){
    this.startDate = moment(this.formatter.format(fromDate));
    this.endDate = moment(this.formatter.format(toDate));
    if (this.endDate.format("DD-MM-YYYY") === 'Invalid date')
      this.endDate = this.startDate;

    for(let i=moment(this.startDate); i.isSameOrBefore(this.endDate);i.add(1,'days')){
      let date = i.format("DD-MM");
      let year = i.format("YYYY");
      this.holiday = {
        _id: id,
        holiday_name: this.userInput.holidayName.value,
        holiday_type: this.userInput.holidayType.value,
        date: date,
        year: year
      }
      this.holidayDuration.push(this.holiday);
      // Save only the first date
      if(id !== null)
        break;
    }
  }

  public getButtonType(){
    let buttonType = this.newRecord === true ? 'Create Holiday' : 'Edit Holiday';
    return buttonType;
  }

  public displayMessage(message:string,status:string){
    this._snackBar.open(message,'Close',{
      duration: 5000,
      panelClass: `notif-${status}`
    });
  }

  public checkHolidayForEdit(){
    this.maintainService.getHolidayForEdit().subscribe(holidayInfo => {
      this.holiday = holidayInfo;
      if (Object.keys(this.holiday).length !== 0){
        this.newRecord = false;
        let getDate = string => (([day,month]) => ({day,month}))(string.split('-'));
        let fullDate = `${getDate(this.holiday.date).day}/${getDate(this.holiday.date).month}/${this.holiday.year}`;
        // Set label 
        this.startDate = fullDate;
        this.endDate = fullDate;
        // Set date in datepicker
        this.editDate = {
          day: parseInt(getDate(this.holiday.date).day),
          month: parseInt(getDate(this.holiday.date).month),
          year: parseInt(this.holiday.year)
        };
        this.fromDate = this.editDate;
        this.toDate = this.editDate;
        // Set Value in form field 
        this.createHolidayForm.patchValue ({
          holidayName: this.holiday.holiday_name,
          holidayType: this.holiday.holiday_type
        });
      } else
        this.router.navigateByUrl('/home/holiday-declaration');
    })
  }

}
