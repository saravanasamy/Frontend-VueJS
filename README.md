# Vue.js Task Manager Frontend

A modern Vue.js frontend application for task management with Pinia state management and Tailwind CSS styling.

## Features

- ✅ Vue 3 with Composition API
- ✅ Pinia for state management
- ✅ Vue Router for navigation
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ Responsive design
- ✅ Task CRUD operations
- ✅ Real-time task status updates
- ✅ Search and filtering
- ✅ Modern UI components

## Project Structure

```
src/
├── components/          # Reusable components
│   └── NavBar.vue      # Navigation component
├── views/              # Page components
│   ├── Home.vue        # Dashboard
│   └── tasks/          # Task-related pages
│       ├── TaskList.vue    # Task listing
│       ├── TaskCreate.vue  # Create new task
│       ├── TaskEdit.vue    # Edit existing task
│       └── TaskShow.vue    # Task details
├── stores/             # Pinia stores
│   └── taskStore.ts    # Task state management
├── services/           # API services
│   └── api.ts          # HTTP client and task API
├── types/              # TypeScript definitions
│   └── task.ts         # Task-related types
├── router/             # Vue Router configuration
│   └── index.ts        # Route definitions
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd Frontend-vuejs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:3000`

## API Integration

The frontend is configured to work with a Laravel backend API. Update the API base URL in `src/services/api.ts` if needed:

```typescript
const api = axios.create({
  baseURL: '/api', // Change this to your API URL
  // ...
})
```

## Backend API Information

This Vue.js frontend is designed to work with a Laravel backend API. For backend/API implementation details, refer to the [Task Manager API repository](https://github.com/saravanasamy/task-manager).

**Key Backend Features:**
- RESTful API endpoints for tasks (CRUD)
- Statistics and metrics endpoints
- Authentication (optional, for future features)
- Error handling and validation

**Main API Endpoints:**
- `GET /api/tasks` — List all tasks
- `GET /api/tasks/{id}` — Get task details
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/{id}` — Update a task
- `DELETE /api/tasks/{id}` — Delete a task
- `GET /api/statistics` — Get dashboard metrics

**Backend Setup:**
1. Clone the backend repo:
   ```bash
   git clone https://github.com/saravanasamy/task-manager.git
   cd task-manager
   ```
2. Install dependencies:
   ```bash
   composer install
   npm install
   ```
3. Configure environment variables (`.env`)
4. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
5. Start the backend server:
   ```bash
   php artisan serve
   ```
6. The API will be available at `http://localhost:8000/api`

**Backend Folder & File Structure:**
```
task-manager/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # API controllers (TaskController, etc.)
│   │   └── Middleware/
│   ├── Models/               # Eloquent models (Task.php, etc.)
├── routes/
│   └── api.php               # API route definitions
├── database/
│   ├── migrations/           # DB schema
│   └── seeders/              # Sample data
├── public/
├── resources/
├── tests/
├── composer.json
├── package.json
└── ...
```

**Key Backend Files:**
- `app/Http/Controllers/TaskController.php`
- `routes/api.php`
- `app/Models/Task.php`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Key Components

### TaskStore (Pinia)
- Manages task state
- Handles API calls
- Provides computed properties for filtered tasks

### Task Views
- **TaskList**: Grid view with search, filters, and quick actions
- **TaskCreate**: Form for creating new tasks with validation
- **TaskEdit**: Form for editing existing tasks
- **TaskShow**: Detailed task view with quick status updates

### API Service
- Axios-based HTTP client
- Request/response interceptors
- TypeScript interfaces for API responses

## Styling

The project uses Tailwind CSS with custom utility classes defined in `src/style.css`:

- `.btn` - Button base styles
- `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button variants
- `.card` - Card container
- `.form-input`, `.form-label` - Form elements

## TypeScript

Full TypeScript support with:
- Type definitions for tasks and API responses
- Strongly typed Pinia stores
- Vue 3 script setup syntax

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include proper error handling
4. Test all functionality
5. Update documentation as needed

## License

MIT License
