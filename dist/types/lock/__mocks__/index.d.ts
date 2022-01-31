/// <reference types="jest" />
declare const Lock: any;
export declare const acquireLockSpy: jest.Mock<any, any>;
export declare const releaseLockSpy: jest.Mock<any, any>;
export default class extends Lock {
    acquireLock(...args: any[]): Promise<any>;
    releaseLock(...args: any[]): any;
}
export {};
