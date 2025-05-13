import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoardComponent } from './task-board.component';
import { TaskService } from './task.service';
import { of } from 'rxjs';
import { Task } from '../models/task.model';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
    const mockUserId = 'user1';

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: '', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasksByUser', 'createTask', 'updateTask', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [TaskBoardComponent],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;
    component.userId = 'user1';
  });

  it('should load tasks at startup', () => {
    mockTaskService.getTasksByUser.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(mockTaskService.getTasksByUser).toHaveBeenCalledWith('user1');
    expect(component.todo.length).toBe(1);
  });

  it('should add new task to the list all', () => {
    const newTask: Task = {
      id: '2',
      title: 'Nueva tarea',
      description: '',
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTaskService.createTask.and.returnValue(of(newTask));

    component.onAddTask({
      title: 'Nueva tarea',
      description: '',
      status: 'todo'
    });

    expect(component.todo.length).toBe(1);
    expect(component.todo[0].title).toBe('Nueva tarea');
  });
});
