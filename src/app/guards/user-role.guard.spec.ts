import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { UserRoleGuard } from './user-role.guard';

describe('userRoleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => UserRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
