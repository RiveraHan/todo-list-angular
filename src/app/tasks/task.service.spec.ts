import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;
  const mockUserId = 'abc123';

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'desc',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);

    // Set the correct backend URL (adjust this to match your backend)
    (service as any).baseUrl = 'http://127.0.0.1:5001/todo-list-atom/us-central1/api/tasks';
  });

  afterEach(() => {
    http.verify();
  });

  it('should fetch tasks by userId', () => {
    service.getTasksByUser('abc123').subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Test Task');
    });

    const req = http.expectOne(`${(service as any).baseUrl}/abc123`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTask]);
  });

  it('should create a task', () => {
    service.createTask(mockTask, mockUserId).subscribe(task => {
      expect(task.title).toBe('Test Task');
    });

    const req = http.expectOne(`${(service as any).baseUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTask);
  });

  it('should update a task', () => {
    service.updateTask('1', { ...mockTask, userId: mockUserId }).subscribe(task => {
      expect(task.status).toBe('todo');
    });

    const req = http.expectOne(`${(service as any).baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockTask);
  });

//   it('should delete a task', () => {
//     service.deleteTask('1').subscribe(response => {
//       expect(response).toBeUndefined();
//     });
  
//     const req = http.expectOne(`${(service as any).baseUrl}/1`);
//     expect(req.request.method).toBe('DELETE');
//     req.flush(null);
//   });
  
});
