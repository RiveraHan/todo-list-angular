import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../models/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Input() task: Partial<Task> | null = null;
  @Output() submitTask = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();
  @Output() cancel = new EventEmitter<void>();


  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { task: Task } | null,
    @Optional() private dialogRef?: MatDialogRef<TaskFormComponent>
  )   {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['todo', Validators.required]
    });
  }  
  
  ngOnInit(): void {
  const t = this.task || this.data?.task;
  if (t) {
    this.form.patchValue(t);
  } else {
    this.form.patchValue({ status: 'todo' });
  }
}

  onSubmit() {
    if (this.form.valid) {
      const taskData = this.form.value;
  
      this.submitTask.emit(taskData);
  
      if (this.dialogRef) {
        this.dialogRef.close();
      } else {
        this.form.reset({ title: '', description: '', status: 'todo' });
        this.cancel.emit(); 
      }
    }
  }
  
  

  closeDialog() {
    this.dialogRef?.close();
  }
}
