import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';
@Pipe({
  name: 'taskFilter',
  standalone: true
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], search: string): Task[] {
    if (!search) return tasks;

    const lower = search.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lower) ||
      task.description?.toLowerCase().includes(lower)
    );
  }
}