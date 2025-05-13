import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const mockUser = { id: 'user1', email: 'test@example.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    (service as any).baseUrl = 'http://127.0.0.1:5001/todo-list-atom/us-central1/api/users';
  });

  afterEach(() => http.verify());

  it('should return an existing user', () => {
    service.loginOrRegister('test@example.com').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = http.expectOne(`${(service as any).baseUrl}/test@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user if not found', () => {
    service.loginOrRegister('new@example.com').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const getReq = http.expectOne(`${(service as any).baseUrl}/new@example.com`);
    getReq.flush(null, { status: 404, statusText: 'Not Found' });

    const postReq = http.expectOne(`${(service as any).baseUrl}`);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.email).toBe('new@example.com');
    postReq.flush(mockUser);
  });
});
