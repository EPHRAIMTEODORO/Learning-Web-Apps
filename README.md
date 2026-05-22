# React JS Learning Plan: Weeks 2-5

## Overview

This plan is for someone who already knows basic React but wants a stronger foundation and a practical path toward building a real frontend for an authenticated REST API.

**Schedule:** 1 hour per weekday  
**Total time:** About 20 hours across 4 weeks  
**Final goal:** By the end of week 5, build a working React frontend that supports login, stores an auth token/JWT, sends authenticated API requests, protects private routes, and displays data from your course REST API.

## Recommended Weekly Rhythm

Use the same simple rhythm each weekday:

- **10 minutes:** Review yesterday's code or notes.
- **20 minutes:** Learn one focused concept.
- **25 minutes:** Build or refactor something small.
- **5 minutes:** Write down what worked, what confused you, and what to do next.

Avoid watching too many tutorials without coding. Each week should produce a working mini-feature.

## Core Tools To Learn Gradually

- **React core:** Components, props, state, effects, conditional rendering, lists, forms, custom hooks.
- **React Router:** Multiple pages, route parameters, navigation, protected routes.
- **Fetch API or Axios:** REST requests, request bodies, headers, error handling.
- **Authentication basics:** Login form, JWT/token storage, authorization headers, logout flow.
- **State management basics:** Local component state, lifted state, Context API for auth.
- **Environment variables:** API base URLs with Vite `.env` files.
- **Project structure:** `components`, `pages`, `services`, `hooks`, `context`, and `utils`.
- **Debugging:** Browser DevTools, Network tab, React DevTools, console logging with purpose.

## Recommended Project Structure

By week 5, aim for a structure like this:

```text
src/
  api/
    client.js
    auth.js
    resources.js
  components/
    Layout.jsx
    Navbar.jsx
    ProtectedRoute.jsx
    Loading.jsx
    ErrorMessage.jsx
  context/
    AuthContext.jsx
  hooks/
    useAuth.js
  pages/
    LoginPage.jsx
    DashboardPage.jsx
    ResourceListPage.jsx
    ResourceDetailPage.jsx
    NotFoundPage.jsx
  App.jsx
  main.jsx
```

You do not need to create all of this immediately. Let the structure grow as the project grows.

---

# Week 2: Strengthen Core React Foundations

## Weekly Goal

Build confidence with components, props, state, events, forms, lists, and effects. By the end of the week, you should be able to build small interactive React features without copying every line from a tutorial.

## Topics To Learn

- Component design and reusable UI pieces.
- Props and passing data down.
- `useState` for component memory.
- Event handlers and controlled inputs.
- Rendering lists with `.map()`.
- Conditional rendering for empty, loading, and error states.
- Basic `useEffect` for synchronizing with outside systems.
- Thinking in React: breaking a UI into components.

## Hands-On Exercises

- Build a **Task Tracker** with:
  - Add task form.
  - Delete task button.
  - Mark task complete/incomplete.
  - Filter buttons: all, active, completed.
- Build a **Reusable Form Input** component.
- Build a **Loading/Error/Data** display component using fake async data.
- Practice lifting state from a child component to a parent component.

## 1-Hour Weekday Plan

### Monday

- Review components, props, and JSX.
- Build static Task Tracker layout.
- Split layout into `TaskList`, `TaskItem`, and `TaskForm`.

### Tuesday

- Add `useState`.
- Make the task form controlled.
- Add new tasks to state.

### Wednesday

- Practice list rendering and event handlers.
- Add complete/delete actions.
- Add empty-state UI when no tasks exist.

### Thursday

- Learn conditional rendering patterns.
- Add task filters.
- Create a small `StatusMessage` or `ErrorMessage` component.

### Friday

- Learn basic `useEffect`.
- Simulate loading tasks from fake data.
- Refactor the Task Tracker into cleaner components.

## Recommended Resources

- [React: Describing the UI](https://react.dev/learn/describing-the-ui)
- [React: Adding Interactivity](https://react.dev/learn/adding-interactivity)
- [React: Managing State](https://react.dev/learn/managing-state)
- [React: Thinking in React](https://react.dev/learn/thinking-in-react)
- [React `useEffect` Reference](https://react.dev/reference/react/useEffect)
- Video option: [Scrimba React Course](https://scrimba.com/learn-react-c0e)

## Milestone Checklist

- [ ] I can explain the difference between props and state.
- [ ] I can build a controlled form input.
- [ ] I can render a list from an array.
- [ ] I can update, add, and delete items in state without mutating state directly.
- [ ] I can split a UI into small components.
- [ ] I can use `useEffect` for a simple loading flow.

---

# Week 3: Routing, Pages, Forms, And API Basics

## Weekly Goal

Turn a React app into a multi-page frontend and start communicating with REST APIs. By the end of the week, you should understand routing, page components, forms, and basic API request patterns.

## Topics To Learn

- React Router setup.
- `BrowserRouter`, `Routes`, `Route`, `Link`, and `NavLink`.
- Page components vs reusable components.
- Route parameters with `useParams`.
- Navigation with `useNavigate`.
- Fetching data from a REST API.
- `GET`, `POST`, `PUT/PATCH`, and `DELETE` request patterns.
- Loading and error state for API calls.
- Environment variables for API URLs.

## Hands-On Exercises

- Build a **Mini Resource Browser**:
  - Home page.
  - Resource list page.
  - Resource detail page with route params.
  - Create resource form.
  - Edit or delete action if your API supports it.
- Use a public API first if your course API is not ready.
- Then switch the API base URL to your own backend using an environment variable.

## 1-Hour Weekday Plan

### Monday

- Install and set up React Router.
- Create `HomePage`, `ResourceListPage`, `ResourceDetailPage`, and `NotFoundPage`.
- Add navigation links.

### Tuesday

- Learn route parameters.
- Build a detail page route like `/resources/:id`.
- Display the route `id` on the page.

### Wednesday

- Learn the Fetch API or Axios.
- Make your first `GET` request.
- Add loading and error states.

### Thursday

- Build a create form.
- Send a `POST` request.
- Refresh or update the list after creating an item.

### Friday

- Add a simple API service file.
- Move fetch logic out of page components.
- Add `.env` support for your API base URL.

## Recommended Resources

- [React Router: Route Component](https://reactrouter.com/api/components/Route)
- [React Router: Navigating](https://reactrouter.com/start/declarative/navigating)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Vite: Env Variables and Modes](https://vite.dev/guide/env-and-mode)

## Milestone Checklist

- [ ] I can create multiple pages in React.
- [ ] I can navigate using React Router links.
- [ ] I can read route parameters.
- [ ] I can fetch and display API data.
- [ ] I can show loading and error states.
- [ ] I can submit a form to an API.
- [ ] I can store my API base URL in a `.env` file.

---

# Week 4: Authentication, Tokens, And Protected Routes

## Weekly Goal

Add login functionality and authenticated API requests. By the end of the week, your frontend should support logging in, storing a token, logging out, protecting routes, and sending the token with API requests.

## Topics To Learn

- How token/JWT authentication usually works.
- Login form flow.
- Handling successful and failed login responses.
- Where to store tokens during development.
- Adding an `Authorization: Bearer <token>` header.
- Auth state with Context API.
- Custom `useAuth` hook.
- Protected routes.
- Logout and clearing auth state.
- Basic security tradeoffs of token storage.

## Important Auth Note

For a course project, storing a JWT in `localStorage` is common and beginner-friendly. In production, token storage has security tradeoffs. HTTP-only secure cookies are often safer against token theft from JavaScript, but they require backend support. Use the approach your course backend expects.

## Hands-On Exercises

- Build a **Login Page**:
  - Email/username input.
  - Password input.
  - Submit button.
  - Error message for invalid login.
- Create an `AuthContext`:
  - `user`
  - `token`
  - `login`
  - `logout`
  - `isAuthenticated`
- Create a `ProtectedRoute` component.
- Update API requests so authenticated endpoints include a bearer token.
- Add a logout button to the navbar.

## 1-Hour Weekday Plan

### Monday

- Review your backend login endpoint.
- Write down:
  - Login URL.
  - Request body shape.
  - Response body shape.
  - Token field name.
  - Any required user fields.
- Build the static login page.

### Tuesday

- Connect the login form to your API.
- Store the returned token.
- Show login errors clearly.

### Wednesday

- Create `AuthContext`.
- Move login/logout/token logic into the context.
- Create a `useAuth` hook.

### Thursday

- Build `ProtectedRoute`.
- Protect dashboard and resource pages.
- Redirect unauthenticated users to `/login`.

### Friday

- Add authenticated API requests.
- Confirm the token appears in the request headers in the browser Network tab.
- Test logout and failed-token behavior.

## Recommended Resources

- [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React Router: Route Component](https://reactrouter.com/api/components/Route)
- [MDN: Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization)
- [JWT.io: Introduction to JSON Web Tokens](https://jwt.io/introduction)
- [Axios: Request Config](https://axios-http.com/docs/req_config)
- [Axios: Interceptors](https://axios-http.com/docs/interceptors)

## Milestone Checklist

- [ ] I can explain the basic login/token flow.
- [ ] I can submit login credentials to my backend.
- [ ] I can store and read a token.
- [ ] I can add a bearer token to API requests.
- [ ] I can protect routes from unauthenticated users.
- [ ] I can log out and clear auth state.
- [ ] I can debug auth requests in the Network tab.

---

# Week 5: Build The Course Frontend

## Weekly Goal

Build the first complete version of your course frontend connected to your authenticated REST API. By the end of the week, you should have a working app that feels like a real frontend project, not just isolated practice files.

## Topics To Learn

- Planning frontend screens from backend endpoints.
- Clean project organization.
- Shared layout and navigation.
- API service modules.
- Auth-aware API requests.
- Form validation basics.
- Handling loading, empty, error, and success states.
- Basic styling consistency.
- Manual testing workflow.
- Preparing for deployment or demo.

## Hands-On Project

Build a **Course API Frontend** with:

- Login page.
- Logout button.
- Protected dashboard.
- List page for your main resource.
- Detail page for one resource.
- Create form.
- Edit or delete flow if supported by your backend.
- Authenticated API requests using your token/JWT.
- Clear loading and error states.
- `.env` file for API base URL.

## 1-Hour Weekday Plan

### Monday

- Plan the frontend from your API.
- Choose the main resource your app will manage.
- Create page list:
  - `/login`
  - `/dashboard`
  - `/resources`
  - `/resources/:id`
  - `/resources/new`
- Create or clean up the folder structure.

### Tuesday

- Build layout and navigation.
- Add protected dashboard route.
- Confirm login/logout still works.

### Wednesday

- Build the resource list page.
- Fetch authenticated data from your API.
- Add loading, empty, and error states.

### Thursday

- Build detail and create pages.
- Add form validation basics.
- Send authenticated `POST` requests.

### Friday

- Polish the workflow.
- Test each user path manually.
- Fix confusing names, repeated code, and missing error states.
- Write a short README section explaining how to run the frontend.

## Recommended Resources

- [React: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [React Router Documentation](https://reactrouter.com/)
- [MDN: HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [Vite: Building for Production](https://vite.dev/guide/build)
- Optional video: [Net Ninja React Tutorials](https://www.youtube.com/@NetNinja)

## Final Project Checklist

- [ ] App runs locally without console errors.
- [ ] Login works with real backend credentials.
- [ ] Invalid login shows an error.
- [ ] Token/JWT is stored after login.
- [ ] Protected pages redirect when logged out.
- [ ] Authenticated requests include the token.
- [ ] Main resource list loads from the API.
- [ ] Detail page loads one resource by ID.
- [ ] Create form sends data to the API.
- [ ] Logout clears the token and redirects appropriately.
- [ ] API base URL comes from an environment variable.
- [ ] Components and pages are organized clearly.
- [ ] Loading, empty, and error states are visible.
- [ ] I can demo the full workflow from login to API data.

---

# Suggested Daily Practice Prompts

Use these when you are unsure what to do during a study session:

- "Can I explain what state changes when I click this button?"
- "Can I move repeated API code into one service function?"
- "What should the user see while the API request is loading?"
- "What should the user see if the API request fails?"
- "Can this component be simpler?"
- "Is this page responsible for too many things?"
- "What happens if I refresh the browser after logging in?"
- "What happens if the token is missing or invalid?"

---

# API Integration Checklist

Before connecting your React app to your real backend, write down this information:

- [ ] Backend base URL.
- [ ] Login endpoint.
- [ ] Login request body example.
- [ ] Login success response example.
- [ ] Login error response example.
- [ ] Token/JWT field name.
- [ ] Main protected resource endpoint.
- [ ] Required request headers.
- [ ] Expected status codes.
- [ ] CORS settings needed by the backend.

Example:

```js
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
  }),
});
```

Authenticated request example:

```js
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resources`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

# Best Practices To Build Early

- Keep page components focused on page-level behavior.
- Move reusable UI into `components`.
- Move API calls into `api` or `services`.
- Keep authentication logic in one place.
- Do not hard-code the backend URL in every component.
- Always handle loading and error states.
- Use meaningful component and variable names.
- Commit small working changes if you are using Git.
- Read error messages carefully before changing code.
- Use the browser Network tab whenever an API request fails.

## Definition Of Done For Week 5

You are done when you can start the React app, log in with real credentials, land on a protected page, fetch protected API data, create or view a resource, log out, and explain how the token moves from login response to authenticated request header.
