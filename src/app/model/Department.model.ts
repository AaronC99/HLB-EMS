import { Employee } from './Employee.model';

export class Department{
    public department_name: string;
    public level: string;
    public department_head: Employee;

    constructor(){
        this.department_head = new Employee();
    }
}