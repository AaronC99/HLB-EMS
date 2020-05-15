import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Employee } from 'src/app/model/Employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private REST_API_SERVER = "http://localhost:3000";
  private _userToEdit: BehaviorSubject<Employee>;

  constructor(
    private httpClient: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this._userToEdit = new BehaviorSubject(new Employee());
    this._userToEdit.next(new Employee());
  }

  set userToEdit(user) {
    this._userToEdit.next(user);
  }

  public getCurrUserToEdit(){
    return this._userToEdit.asObservable();
  }

  public getAllDepartments(){
    return this.httpClient.get(this.REST_API_SERVER+'/department/alldepartments');
  }

  public getAllSchedules(){
    return this.httpClient.get(this.REST_API_SERVER+'/schedule/allschedules');
  }

  public addEmployee(employeeDetails:any){
    this.httpClient.post(this.REST_API_SERVER+'/employee/addEmployee',employeeDetails).subscribe();
  }

  public checkDuplicate(userInput:string){
    return this.httpClient.get(this.REST_API_SERVER+'/employee/checkduplicate/'+userInput);
  }

  public updateEmployee(selectedDomainId: string, updateDetails:any){
    return this.httpClient.patch(`${this.REST_API_SERVER}/employee/updateEmployee/${selectedDomainId}`,updateDetails)
  }

  public createHoliday(holidayDates){
    this.httpClient.post(`${this.REST_API_SERVER}/holiday/saveHoliday`,holidayDates).subscribe(
      data =>{
        let holidayArray:any = data;
        holidayArray.forEach(element => {
          if (element !== null)
            this.displayMessage('Holiday Created Successfully','success');
        });
      });
  }

  public viewHolidays(){
    return this.httpClient.get(`${this.REST_API_SERVER}/holiday/viewAllHoliday`);
  }

  public displayMessage(message:string,status:string){
    this._snackBar.open(message,'Close',{
      duration: 5000,
      panelClass: `notif-${status}`
    });
  }
}
