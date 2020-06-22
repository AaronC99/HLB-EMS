import { PipeTransform, Pipe } from '@angular/core';
import { EmployeeReport } from 'src/app/model/EmployeeReport.model';
import { LateReportComponent } from './late-report.component';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform{

    constructor(private reporting:LateReportComponent){
    }

    transform(employees:EmployeeReport[],searchTerm:string): EmployeeReport[]{
        if (!employees || !searchTerm){
            employees = employees;
        } 
        else {
            employees = employees.filter(employee => 
                employee.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
        }
        this.reporting.renderCharts(employees);
        return employees;
    }
}