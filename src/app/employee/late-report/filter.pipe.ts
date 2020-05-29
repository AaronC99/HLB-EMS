import { PipeTransform, Pipe } from '@angular/core';
import { EmployeeReport } from 'src/app/model/EmployeeReport.model';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform{
    transform(employees:EmployeeReport[],searchTerm:string): EmployeeReport[]{
        if (!employees || !searchTerm){
            return employees;
        }

        return employees.filter(employee => 
            employee.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}