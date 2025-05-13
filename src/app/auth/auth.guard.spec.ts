import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access if userId is present', () => {
    localStorage.setItem('userId', 'abc123');

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBeTrue();
  });

  it('should redirect to login if userId is missing', () => {
    localStorage.removeItem('userId');

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
