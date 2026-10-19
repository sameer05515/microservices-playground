require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const fs = require("fs");
const path = require("path");

const app = express();
const dbFile = path.join(__dirname, "data", "db.json");
if (!fs.existsSync(dbFile)) {
  const seed = {
    users: [],
    courses: [
      { id: "course-js", title: "JavaScript: From Zero to Hero", subtitle: "Build a strong foundation in modern JavaScript.", category: "Development", level: "Beginner", price: 499, instructor: "Alex Morgan", description: "Learn variables, functions, arrays, objects, DOM basics and asynchronous JavaScript with short, practical lessons.", image: "js", rating: 4.7, lessons: [
        { id: "js-1", title: "Welcome and course roadmap", duration: "4 min", content: "Welcome! In this course you will learn JavaScript step by step. Start with the basics, practise every concept, and build small projects as you go." },
        { id: "js-2", title: "Variables and data types", duration: "12 min", content: "Use const by default and let when reassignment is needed. JavaScript has primitive values such as string, number, boolean, null, undefined, bigint and symbol, plus objects." },
        { id: "js-3", title: "Functions and arrow functions", duration: "15 min", content: "Functions package reusable behaviour. Function declarations, expressions and arrow functions differ in syntax and how they handle this. Keep functions small and give them clear names." },
        { id: "js-4", title: "Arrays and objects", duration: "18 min", content: "Arrays store ordered collections. Objects represent keyed data. Practise map, filter, find, reduce, destructuring and spread syntax." },
        { id: "js-5", title: "Async JavaScript and fetch", duration: "20 min", content: "Promises represent future results. async/await makes promise-based code easier to read. fetch() can request data from HTTP APIs; check response.ok before parsing the body." }
      ]},
      { id: "course-spring", title: "Spring Boot & REST APIs", subtitle: "Create clean backend services with Spring Boot.", category: "Development", level: "Intermediate", price: 899, instructor: "Priya Sharma", description: "Understand controllers, services, repositories, validation, exception handling and REST API design through a practical backend workflow.", image: "spring", rating: 4.8, lessons: [
        { id: "sp-1", title: "Spring Boot project structure", duration: "8 min", content: "A typical Spring Boot application separates web controllers, business services and data access. Keep configuration external and organise packages by feature or layer." },
        { id: "sp-2", title: "Dependency injection", duration: "14 min", content: "Spring manages beans in its application context. Constructor injection makes dependencies explicit, improves testability and helps avoid partially initialised objects." },
        { id: "sp-3", title: "Build a REST controller", duration: "17 min", content: "Use @RestController for JSON endpoints, mapping annotations for routes, DTOs for request and response shapes, and meaningful HTTP status codes." },
        { id: "sp-4", title: "Validation and exception handling", duration: "16 min", content: "Validate request DTOs with Jakarta Bean Validation and @Valid. Use @RestControllerAdvice to translate exceptions into consistent, useful API error responses." }
      ]},
      { id: "course-ui", title: "HTML, CSS & Responsive Design", subtitle: "Design responsive web pages from scratch.", category: "Design", level: "Beginner", price: 399, instructor: "Jamie Lee", description: "Learn semantic HTML, CSS layouts, Flexbox, Grid, responsive breakpoints and accessible interface basics.", image: "design", rating: 4.6, lessons: [
        { id: "ui-1", title: "Semantic HTML", duration: "10 min", content: "Choose elements based on meaning: header, nav, main, section, article and footer. Semantic markup improves accessibility and helps maintainers understand your page." },
        { id: "ui-2", title: "CSS layout with Flexbox", duration: "14 min", content: "Flexbox is ideal for arranging items along one dimension. Practise justify-content, align-items, gap, flex-wrap and flexible sizing." },
        { id: "ui-3", title: "Responsive design with Grid", duration: "18 min", content: "CSS Grid is useful for two-dimensional layouts. Combine minmax(), repeat(), auto-fit and media queries to build layouts that adapt to different screens." }
      ]},
      { id: "course-sql", title: "SQL Essentials for Developers", subtitle: "Query relational data with confidence.", category: "IT & Software", level: "Beginner", price: 599, instructor: "Ravi Patel", description: "Practise SELECT, filtering, joins, aggregation, subqueries and indexes with developer-focused examples.", image: "sql", rating: 4.5, lessons: [
        { id: "sql-1", title: "Tables and SELECT", duration: "9 min", content: "Relational databases store data in tables. SELECT retrieves columns, WHERE filters rows, ORDER BY sorts results, and LIMIT caps the number of returned rows." },
        { id: "sql-2", title: "JOINs explained", duration: "15 min", content: "INNER JOIN returns matching rows, LEFT JOIN preserves every row from the left table, and joining on the right keys connects related data." },
        { id: "sql-3", title: "GROUP BY and aggregates", duration: "13 min", content: "COUNT, SUM, AVG, MIN and MAX aggregate values. GROUP BY forms groups, while HAVING filters aggregated groups." }
      ]}
    ],
    enrollments: [],
    progress: [],
    reviews: []
  };
  fs.writeFileSync(dbFile, JSON.stringify(seed, null, 2));
}
const readDb = () => JSON.parse(fs.readFileSync(dbFile, "utf8"));
const saveDb = db => fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
const makeId = prefix => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const safeUser = user => user && ({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
const currentUser = (db, req) => db.users.find(user => user.id === req.session.userId);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET || "local-demo-secret-change-me",
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 86400000 }
}));
app.use((req, res, next) => {
  const db = readDb();
  res.locals.me = req.session.userId ? safeUser(currentUser(db, req)) : null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});
function requireAuth(req, res, next) {
  if (!req.session.userId || !currentUser(readDb(), req)) {
    req.session.flash = "Please log in to continue.";
    return res.redirect("/login");
  }
  next();
}
function getCourse(db, id) { return db.courses.find(course => course.id === id); }
function isEnrolled(db, userId, courseId) {
  return db.enrollments.some(item => item.userId === userId && item.courseId === courseId);
}
function completedLessonIds(db, userId, courseId) {
  return db.progress.filter(p => p.userId === userId && p.courseId === courseId && p.completed).map(p => p.lessonId);
}
function courseCard(db, course, userId) {
  const reviews = db.reviews.filter(r => r.courseId === course.id);
  const rating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : course.rating;
  const enrolled = userId ? isEnrolled(db, userId, course.id) : false;
  const done = userId ? completedLessonIds(db, userId, course.id).length : 0;
  return { ...course, rating, enrolled, progressPercent: enrolled && course.lessons.length ? Math.round(done / course.lessons.length * 100) : 0, reviewCount: reviews.length };
}
app.get("/", (req, res) => res.redirect(req.session.userId ? "/courses" : "/login"));
app.get("/register", (req, res) => res.render("register", { error: null }));
app.post("/register", async (req, res) => {
  const db = readDb(), { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password) return res.status(400).render("register", { error: "Please complete all fields." });
  if (password.length < 8 || password !== confirmPassword) return res.status(400).render("register", { error: "Passwords must match and contain at least 8 characters." });
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return res.status(400).render("register", { error: "An account with this email already exists." });
  const user = { id: makeId("user"), name: name.trim().slice(0, 70), email: email.trim().toLowerCase(), hash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
  db.users.push(user); saveDb(db); req.session.userId = user.id; res.redirect("/courses");
});
app.get("/login", (req, res) => res.render("login", { error: null }));
app.post("/login", async (req, res) => {
  const db = readDb(), email = String(req.body.email || "").trim().toLowerCase();
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(req.body.password || "", user.hash))) return res.status(401).render("login", { error: "Email or password is incorrect." });
  req.session.userId = user.id; res.redirect("/courses");
});
app.post("/logout", (req, res) => req.session.destroy(() => res.redirect("/login")));
app.get("/courses", (req, res) => {
  const db = readDb(), q = String(req.query.q || "").trim().toLowerCase(), category = String(req.query.category || "");
  const courses = db.courses.filter(c => (!q || [c.title, c.subtitle, c.instructor, c.category, c.description].some(v => String(v).toLowerCase().includes(q))) && (!category || c.category === category)).map(c => courseCard(db, c, req.session.userId));
  const categories = [...new Set(db.courses.map(c => c.category))].sort();
  res.render("courses", { courses, q: req.query.q || "", category, categories });
});
app.get("/courses/:id", (req, res) => {
  const db = readDb(), course = getCourse(db, req.params.id);
  if (!course) return res.status(404).render("error", { message: "Course not found." });
  const userId = req.session.userId;
  const reviews = db.reviews.filter(r => r.courseId === course.id).map(r => ({ ...r, author: safeUser(db.users.find(u => u.id === r.userId)) })).reverse();
  const enrolled = userId ? isEnrolled(db, userId, course.id) : false;
  const done = enrolled ? completedLessonIds(db, userId, course.id) : [];
  res.render("course", { course: courseCard(db, course, userId), enrolled, done, reviews, hasReviewed: userId ? db.reviews.some(r => r.courseId === course.id && r.userId === userId) : false });
});
app.post("/courses/:id/enroll", requireAuth, (req, res) => {
  const db = readDb(), course = getCourse(db, req.params.id);
  if (!course) return res.status(404).render("error", { message: "Course not found." });
  if (!isEnrolled(db, req.session.userId, course.id)) db.enrollments.push({ id: makeId("enroll"), userId: req.session.userId, courseId: course.id, enrolledAt: new Date().toISOString() });
  saveDb(db); req.session.flash = "You're enrolled! Start learning.";
  res.redirect(`/learn/${course.id}`);
});
app.get("/learn/:id", requireAuth, (req, res) => {
  const db = readDb(), course = getCourse(db, req.params.id);
  if (!course) return res.status(404).render("error", { message: "Course not found." });
  if (!isEnrolled(db, req.session.userId, course.id)) return res.redirect(`/courses/${course.id}`);
  const done = completedLessonIds(db, req.session.userId, course.id);
  const requested = String(req.query.lesson || "");
  const lesson = course.lessons.find(l => l.id === requested) || course.lessons.find(l => !done.includes(l.id)) || course.lessons[0];
  res.render("learn", { course, lesson, done, percent: course.lessons.length ? Math.round(done.length / course.lessons.length * 100) : 0 });
});
app.post("/learn/:id/lessons/:lessonId/complete", requireAuth, (req, res) => {
  const db = readDb(), course = getCourse(db, req.params.id);
  if (!course || !isEnrolled(db, req.session.userId, course.id) || !course.lessons.some(l => l.id === req.params.lessonId)) return res.redirect("/courses");
  let progress = db.progress.find(p => p.userId === req.session.userId && p.courseId === course.id && p.lessonId === req.params.lessonId);
  if (!progress) { progress = { id: makeId("progress"), userId: req.session.userId, courseId: course.id, lessonId: req.params.lessonId, completed: true, completedAt: new Date().toISOString() }; db.progress.push(progress); }
  else { progress.completed = true; progress.completedAt = new Date().toISOString(); }
  saveDb(db);
  const index = course.lessons.findIndex(l => l.id === req.params.lessonId), next = course.lessons[index + 1];
  res.redirect(next ? `/learn/${course.id}?lesson=${next.id}` : `/learn/${course.id}`);
});
app.get("/my-learning", requireAuth, (req, res) => {
  const db = readDb(), mine = db.enrollments.filter(e => e.userId === req.session.userId).map(e => getCourse(db, e.courseId)).filter(Boolean).map(c => courseCard(db, c, req.session.userId));
  res.render("my-learning", { courses: mine });
});
app.post("/courses/:id/reviews", requireAuth, (req, res) => {
  const db = readDb(), course = getCourse(db, req.params.id), rating = Number(req.body.rating), text = String(req.body.text || "").trim();
  if (!course || !isEnrolled(db, req.session.userId, req.params.id)) { req.session.flash = "Enroll in the course before reviewing it."; return res.redirect(`/courses/${req.params.id}`); }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || db.reviews.some(r => r.courseId === course.id && r.userId === req.session.userId)) { req.session.flash = "Please choose a valid rating. You can review each course once."; return res.redirect(`/courses/${req.params.id}`); }
  db.reviews.push({ id: makeId("review"), courseId: course.id, userId: req.session.userId, rating, text: text.slice(0, 800), createdAt: new Date().toISOString() }); saveDb(db); res.redirect(`/courses/${course.id}`);
});
app.use((req, res) => res.status(404).render("error", { message: "Page not found." }));
app.listen(process.env.PORT || 3000, () => console.log(`Mini Udemy running at http://localhost:${process.env.PORT || 3000}`));
