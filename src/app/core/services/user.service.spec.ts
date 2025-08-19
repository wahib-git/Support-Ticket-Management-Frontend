import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [
      {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin' as 'admin', // explicitly type as one of the allowed literals
      },
    ];
    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/admin/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
