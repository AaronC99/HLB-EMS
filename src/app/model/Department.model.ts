import { Employee } from './Employee.model';

export class Department{
    public _id: string;
    public department_name: string;
    public level: string;
    public department_head: Employee;

    constructor(departmentName?) {
        this.department_head = new Employee();
        this.department_name = departmentName ? departmentName : undefined;
    }
}