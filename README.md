- **Drizzle ORM** - Type-safe database toolkit
- **Zod** - Schema validation
- **Neon** - Serverless PostgreSQL hosting

### State Management
- **React Query** (TanStack Query) - Server state management via tRPC
- **React Hooks** - Local component state

##  Features Implemented

###  Priority 1 (Must Have) - Complete
-  Blog post CRUD operations (create, read, update, delete)
-  Category CRUD operations
-  Assign multiple categories to posts
-  Blog listing page with all posts
-  Individual post view page
-  Category filtering on listing page
-  Responsive navigation with mobile menu
-  Clean, professional UI

###  Priority 2 (Should Have) - Complete
-  Landing page with Hero, Features, and Footer sections
-  Dashboard for managing posts
-  Draft vs Published post status
-  Loading and error states throughout
-  Fully mobile-responsive design


###  Priority 3 (Nice to Have) - Implemented
-  Enhanced landing page with CTA section
-  Real-time updates (no page refresh needed)
-  Optimistic UI updates
-  Category post counts
-  Featured stories section

##  Project Structure
```
blog-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/trpc/[trpc]/   # tRPC API route handler
│   │   ├── categories/        # Category management pages
│   │   ├── dashboard/         # Dashboard & post editor
│   │   ├── posts/             # Blog listing & individual posts
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable React components
│   │   ├── navigation.tsx     # Nav with mobile menu
│   │   └── providers.tsx      # tRPC & React Query setup
│   ├── db/                    # Database layer
│   │   ├── index.ts           # Database connection
│   │   └── schema.ts          # Drizzle schema definitions
│   ├── lib/                   # Utilities
│   │   └── trpc.ts            # tRPC client setup
│   └── server/                # Backend logic
│       ├── routers/           # tRPC routers
│       │   ├── _app.ts        # Main router
│       │   ├── post.ts        # Post operations
│       │   └── category.ts    # Category operations
│       └── trpc.ts            # tRPC initialization
├── drizzle/                   # Database migrations
├── .env.local                 # Environment variables
├── drizzle.config.ts          # Drizzle configuration
├── package.json
└── tsconfig.json
```

##  Database Schema

### Posts Table
```typescript
- id: serial (primary key)
- title: text (not null)
- content: text (not null)
- slug: text (unique, not null)
- published: boolean (default: false)
- createdAt: timestamp
- updatedAt: timestamp
```

### Categories Table
```typescript
- id: serial (primary key)
- name: text (not null)
- description: text
- slug: text (unique, not null)
- createdAt: timestamp
```

### Post_Categories Table (Junction)
```typescript
- id: serial (primary key)
- postId: integer (foreign key → posts.id)
- categoryId: integer (foreign key → categories.id)
```

**Relationships:**
- Posts ↔ Categories: Many-to-Many via post_categories junction table

##  tRPC Router Structure

### Post Router (`/api/trpc/post.*`)
```typescript
post.getAll      - Fetch all posts (with filtering)
post.getBySlug   - Get single post by slug
post.create      - Create new post
post.update      - Update existing post
post.delete      - Delete post
```

### Category Router (`/api/trpc/category.*`)
```typescript
category.getAll  - Fetch all categories
category.create  - Create new category
category.update  - Update existing category
category.delete  - Delete category
```

**Features:**
-  End-to-end type safety with automatic inference
-  Zod schema validation on all inputs
-  Proper error handling with user-friendly messages
-  Automatic slug generation for posts and categories
-  Cascade deletion of relationships

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Neon account)
- Git

### Installation

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd blog-platform
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
```env
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

   **To get your DATABASE_URL:**
   - Sign up at [Neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string (use the pooled connection)

4. **Generate and push database schema**
```bash
   # Generate migration files
   npm run db:generate
   
   # Push schema to database
   npm run db:push
```

5. **Seed the database (optional)**
```bash
   npm run db:seed
```

6. **Run the development server**
```bash
   npm run dev
```

7. **Open your browser**
   
   Navigate to `http://localhost:3000`

##  Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
```

##  Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `DATABASE_URL`
   - Click "Deploy"

3. **Your app is live!** 

##  Key Design Decisions

### Why tRPC?
- **Type Safety**: Automatic type inference from server to client
- **No Code Generation**: Direct TypeScript types
- **Better DX**: Autocomplete and type checking everywhere

### Why Drizzle ORM?
- **Lightweight**: Smaller bundle size than Prisma
- **Type-Safe**: Full TypeScript support
- **SQL-like**: Closer to raw SQL for better control

### Why Markdown over Rich Text?
- **Faster Development**: 2-3 hours saved
- **Better Performance**: No heavy editor libraries
- **Writer-Friendly**: Many writers prefer markdown

### Why Server Components?
- **Performance**: Data fetched on server = faster initial load
- **SEO**: Pre-rendered content for search engines
- **Less JavaScript**: Smaller client bundle

### State Management Approach
- **Server State**: React Query (via tRPC) for all server data
- **Client State**: React hooks (useState) for UI state
- **No Zustand needed**: React Query handles caching/invalidation

## Performance Optimizations

1. **Server-Side Rendering**: All pages pre-rendered on server
2. **Data Caching**: React Query caches API responses
3. **Optimistic Updates**: UI updates before server confirms
4. **Code Splitting**: Next.js automatically splits code
5. **Image Optimization**: Next.js Image component (if images added)

##  Known Limitations & Trade-offs

1. **No Authentication**: Focus was on core blogging features (as specified)
2. **Basic Editor**: Textarea-based, not rich text (time-saving decision)
3. **No Image Upload**: Would require additional storage setup
4. **No Pagination**: All posts loaded at once (fine for MVP)
5. **No Search**: Could be added as a bonus feature

##  Security Considerations

-  SQL Injection protection (Drizzle ORM parameterized queries)
-  XSS protection (React escapes by default)
-  Input validation (Zod schemas on all API inputs)
- Type safety (TypeScript prevents type-related bugs)

## 📊 Testing

To test all features:

1. **Create Categories**
   - Go to `/categories`
   - Click "New Category"
   - Add: Technology, Lifestyle, Travel

2. **Create Posts**
   - Go to `/dashboard`
   - Click "New Post"
   - Add title, content, select categories
   - Toggle draft/publish

3. **Test Filtering**
   - Go to `/posts`
   - Click on different category filters
   - Verify posts are filtered correctly

4. **Test CRUD**
   - Edit a post from dashboard
   - Delete a post
   - Create draft, then publish it



## 👤 Author

**Your Name**
- GitHub: [anusree-a](https://github.com/anusree-a)
- LinkedIn: [Anusree A](www.linkedin.com/in/anusree771)



## 🙏 Acknowledgments

- Next.js team for the amazing framework
- tRPC for type-safe APIs
- Drizzle team for the excellent ORM
- Vercel for free hosting

---

