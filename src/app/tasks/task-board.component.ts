import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { TaskCardComponent } from './task-card.component';
import { Task, TaskStatus } from '../models/task.model';
import { TaskFormComponent } from './task-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskFilterPipe } from './task-filter.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from './task.service';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Router } from '@angular/router';



@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    TaskCardComponent,
    TaskFormComponent,
    MatSnackBarModule,
    TaskFilterPipe
  ],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class TaskBoardComponent {
  userEmail: string = localStorage.getItem('userEmail') || '';
  userId = localStorage.getItem('userId') || '';
  searchText: string = '';
  hoveredColumn: TaskStatus | null = null;

  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private taskService: TaskService,
    private router: Router
  ) {}


  ngOnInit(): void {
    if (!this.userId) return;
  
    this.taskService.getTasksByUser(this.userId).subscribe(tasks => {
      this.todo = tasks.filter(t => t.status === 'todo');
      this.inProgress = tasks.filter(t => t.status === 'in-progress');
      this.done = tasks.filter(t => t.status === 'done');
  });
}

drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
  this.hoveredColumn = null;

  const task = event.previousContainer.data[event.previousIndex];

  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    task.status = newStatus;

    this.taskService.updateTask(task.id, {
      title: task.title,
      description: task.description,
      status: newStatus,
      userId: this.userId
    }).subscribe(() => {
      this.snackBar.open(`Moving Task "${newStatus}"`, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }
}

  onEdit(task: Task) {
    const originalStatus = task.status;
  
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      panelClass: 'task-dialog',
      data: { task: { ...task } },
      disableClose: true
    });
  
    const instance = dialogRef.componentInstance;
  
    instance.task = { ...task };
  
    instance.submitTask.subscribe((updated) => {
      this.taskService.updateTask(task.id, {
        ...updated,
        userId: this.userId
      }).subscribe(() => {
        task.title = updated.title;
        task.description = updated.description;
  
        if (updated.status !== originalStatus) {
          this.removeFromCurrentList(task.id, originalStatus);
          task.status = updated.status;
          this.addToNewList(task);
        }
  
        this.snackBar.open('Updated Task', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
  
        dialogRef.close();
      });
    });
  }
  
  

  removeFromCurrentList(taskId: string, status: TaskStatus) {
    if (status === 'todo') {
      this.todo = this.todo.filter(t => t.id !== taskId);
    } else if (status === 'in-progress') {
      this.inProgress = this.inProgress.filter(t => t.id !== taskId);
    } else if (status === 'done') {
      this.done = this.done.filter(t => t.id !== taskId);
    }
  }
  
  
  addToNewList(task: Task) {
    if (task.status === 'todo') this.todo.push(task);
    else if (task.status === 'in-progress') this.inProgress.push(task);
    else this.done.push(task);
  }  
  
  onDelete(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(() => {
      this.removeFromCurrentList(task.id, task.status);
  
      this.snackBar.open('Removed Task', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    });
  }
  
  
  onToggleComplete(task: Task) {
    const originalStatus = task.status;
  
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    task.status = newStatus;
  
    this.taskService.updateTask(task.id, {
      title: task.title,
      description: task.description,
      status: newStatus,
      userId: this.userId
    }).subscribe(() => {
      this.removeFromCurrentList(task.id, originalStatus);
      this.addToNewList(task);
  
      this.snackBar.open(
        newStatus === 'done' ? 'Completed Tasks 🎉' : 'Task pendient',
        'Close',
        { duration: 3000, panelClass: ['snackbar-success'] }
      );
    });
  }
  

  onAddTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    this.taskService.createTask(data, this.userId).subscribe(newTask => {
      switch (newTask.status) {
        case 'todo': this.todo.push(newTask); break;
        case 'in-progress': this.inProgress.push(newTask); break;
        case 'done': this.done.push(newTask); break;
      }
  
      this.showForm[newTask.status] = false;
  
      this.snackBar.open('Created Task successful', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });
    });
  }  

  showForm: Record<TaskStatus, boolean> = {
    todo: false,
    'in-progress': false,
    done: false
  };

  onDropEnter(column: TaskStatus) {
    this.hoveredColumn = column;
  }
  
  onDropExit() {
    this.hoveredColumn = null;
  }

  logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
  
    this.snackBar.open('Sesión close', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  
    this.router.navigate(['/login']);
  }
  

}
