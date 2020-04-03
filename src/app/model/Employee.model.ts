import { Schedule } from './Schedule.model';
import { Department } from './Department.model';

export class Employee{
    public name: string;
    public domainId: string;
    public icNumber: string;
    public address: string;
    public gender: string;
    public email: string;
    public role: string;
    public schedule: Schedule;
    public department: Department;

    constructor() {
        this.schedule = new Schedule();
    }
}