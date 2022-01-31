const Lock = jest.requireActual('../index').default;

export const acquireLockSpy = jest.fn().mockResolvedValue(true);
export const releaseLockSpy = jest.fn();

export default class extends Lock {
  async acquireLock(...args: any[]) {
    const canProceed = await acquireLockSpy(...args);
    if (canProceed) {
      return super.acquireLock(...args);
    }
  }
  releaseLock(...args: any[]) {
    releaseLockSpy(...args);
    return super.releaseLock(...args);
  }
}
