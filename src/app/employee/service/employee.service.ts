import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'src/app/model/Employee.model';
import { BehaviorSubject, scheduled } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private REST_API_SERVER = "http://localhost:3000";
  private currUserObj:Employee = new Employee();
  private currUserSubj: BehaviorSubject<Employee>;

  get currUserDetils(){
    return this.currUserSubj.asObservable();
  }
  constructor(
    private httpClient: HttpClient
  ) {
    this.currUserSubj = new BehaviorSubject(this.currUserObj);
    this.currUserSubj.next(this.currUserObj);
   }

  public getProfileDetails(ProfileID:String){
    this.httpClient.get(this.REST_API_SERVER+'/profile/'+ProfileID)
      .subscribe((data) => {
        console.log(data);
        this.currUserObj = {
          name: data['name'],
          domainId: data['domain_id'],
          icNumber: data['ic'],
          address: data['address'],
          email: data['email'],
          role: data['role'],
          schedule: data['schedule_id'],
          // schedule: {
          //   scheduleId: data['schedule_id'],
          //   workingDays: data['days_of_work'],
          //   startTime: data['start_time'],
          //   endTime: data['end_time']
          // },
          department: data['department_id'] 
        };
        this.currUserSubj.next(this.currUserObj);
        //console.log(data['schedule_id']['days_of_work']);
        // console.log(JSON.parse(`{ schedule_id: 'S001',
        // days_of_work: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ],
        // start_time: '8:30 am',
        // end_time: '5:30 pm' }`));
      });
  }

  public getAllEmployees(DomainID:string){ //pass in the id of current user to check if its admin or manager
    return this.httpClient.get(this.REST_API_SERVER+'/allEmployees/'+DomainID);
  }

  public addEmployee(employeeDetails:any){ //pass in the employee object
    this.httpClient.post(this.REST_API_SERVER+'/addEmployee',employeeDetails).subscribe((data)=>{
      console.log(data);
    });
  }

  public updateEmployee(SelectedEmpID: string, updateDetails:any){
    this.httpClient.patch(this.REST_API_SERVER+'/updateEmployee/'+SelectedEmpID, updateDetails).subscribe((data:any)=>{
      console.log(data);
    });
  }
}
