import { Employee } from './Employee.model';

export class Department{
    public name: string;
    public location: string;
    public supervisorName:Employee;
    
    constructor() {
        this.supervisorName = new Employee();
    }
}