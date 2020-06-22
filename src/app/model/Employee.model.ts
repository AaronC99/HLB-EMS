import { Schedule } from './Schedule.model';
import { Department } from './Department.model';

export class Employee{
    public name: string;
    public domain_id: string;
    public ic: string;
    public address: string;
    public gender: string;
    public email: string;
    public role: string;
    public schedule: Schedule;
    public department: Department;
    public annual_leave: Number;
    public medical_leave: Number;

    constructor() {
        this.schedule = new Schedule();
    }
}