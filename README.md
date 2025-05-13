# 📝 Angular Kanban Todo App

Aplicación moderna de tareas tipo Kanban construida con **Angular 17**, **Angular Material** y **Drag & Drop** para mover tareas entre columnas (`To Do`, `In Progress`, `Done`). Integrada con backend (API REST) para persistencia de tareas por usuario.

---

## 🚀 Tecnologías

### Frontend
- [✔️] Angular 17 Standalone
- [✔️] Angular Material (UI)
- [✔️] RxJS
- [✔️] DragDropModule (CDK)
- [✔️] Animaciones con Angular Animations
- [✔️] Formulario reactivo
- [✔️] HttpClient + Router

### Backend (API REST)
- `GET /users/:email` → busca usuario
- `POST /users` → crea usuario
- `GET /tasks/:userId` → carga tareas
- `POST /tasks` → crea tarea
- `PUT /tasks/:taskId` → actualiza
- `DELETE /tasks/:taskId` → elimina

---

## 🧩 Arquitectura

- `LoginComponent`: pantalla de inicio por email
- `TaskBoardComponent`: Kanban completo con drag and drop
- `TaskCardComponent`: visualización de tarea individual
- `TaskFormComponent`: modal/form para crear o editar
- `TaskService`: conecta con backend REST
- `AuthService`: login + creación de usuario
- `AuthGuard`: protege la ruta de tareas

---

## 📦 Estructura del proyecto
```
src/
├── auth/
│ ├── login.component.ts
│ ├── login.component.html
│ ├── login.component.scss
│ ├── auth.service.ts
│ └── auth.guard.ts
├── tasks/
│ ├── task-board.component.ts
│ ├── task-board.component.html
│ ├── task-board.component.scss
│ ├── task-card.component.ts
│ ├── task-card.component.html
│ ├── task-card.component.scss
│ ├── task-form.component.ts
│ ├── task-form.component.html
│ ├── task-form.component.scss
│ ├── task.service.ts
│ └── task-filter.pipe.ts
├── models/
│ └── task.model.ts
└── app.routes.ts
```
---

## ✅ Funcionalidades principales

- 🔐 Login por email (crea usuario si no existe)
- 🧠 Carga de tareas por usuario
- ➕ Crear tareas desde cualquier columna
- ✏️ Editar tarea en modal
- 🗑️ Eliminar tarea
- 🔄 Drag and drop para mover entre columnas
- ✔️ Marcar como completada (mueve automáticamente a `Done`)
- 🔎 Búsqueda en tiempo real por título o descripción
- 🌙 UI moderna y responsive
- 🔒 Protección con `AuthGuard` para `/tasks`
- 📦 Persiste con backend REST

---

## ⚙️ Instalación y ejecución

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/todo-kanban-app.git
cd todo-kanban-app

# Instala dependencias
npm install

# Ejecuta el frontend
ng serve

ng test


```

### Pruebas cubiertas

- ✅ **TaskService**: CRUD de tareas
- ✅ **TaskBoardComponent**: lógica de UI básica
- ✅ **AuthService**: login y creación
- ✅ **AuthGuard**: protección de rutas



Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
