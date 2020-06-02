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
            return employees;
        }
        this.reporting.renderCharts(employees);
        return employees.filter(employee => 
            employee.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}