import React, { useEffect, useMemo, useState } from "react";

// Single-file, drop-in React component
// TailwindCSS recommended. No external deps.
// localStorage persistence + import/export JSON

// ---------- utils ----------
const LS_KEY = "french-learning-tracker@v1";
const todayStr = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local tz
const uid = () => Math.random().toString(36).slice(2, 10);

// ---------- seed data (editable) ----------
const seedTasks = [
  // Month 1
  { id: uid(), title: "Alphabet & sounds – 10 mins", month: 1, type: "daily" },
  { id: uid(), title: "Greetings pack (bonjour, merci...)", month: 1, type: "one-time" },
  { id: uid(), title: "Articles & gender (le/la/les)", month: 1, type: "one-time" },
  { id: uid(), title: "Verbs: être / avoir / aller – 10 mins", month: 1, type: "daily" },
  { id: uid(), title: "App practice (Duolingo/Memrise) – 15 mins", month: 1, type: "daily" },

  // Month 2
  { id: uid(), title: "Present tense drill (reg+irreg) – 10 mins", month: 2, type: "daily" },
  { id: uid(), title: "Numbers / days / months", month: 2, type: "one-time" },
  { id: uid(), title: "Mini dialogues (café order)", month: 2, type: "one-time" },
  { id: uid(), title: "Anki flashcards – 10 mins", month: 2, type: "daily" },
  { id: uid(), title: "Coffee Break French – 1 episode", month: 2, type: "daily" },

  // Month 3
  { id: uid(), title: "Shadowing – 10 mins", month: 3, type: "daily" },
  { id: uid(), title: "Adjectives & negation", month: 3, type: "one-time" },
  { id: uid(), title: "Watch French show (Lupin) – 20 mins", month: 3, type: "daily" },

  // Month 4
  { id: uid(), title: "Read 1 page (Le Petit Prince)", month: 4, type: "daily" },
  { id: uid(), title: "Write journal – 5 lines", month: 4, type: "daily" },
  { id: uid(), title: "Past tense (passé composé)", month: 4, type: "one-time" },

  // Month 5
  { id: uid(), title: "Future tense & reflexives", month: 5, type: "one-time" },
  { id: uid(), title: "YouTubers (InnerFrench) – 15 mins", month: 5, type: "daily" },
  { id: uid(), title: "Travel/hobby dialogues", month: 5, type: "one-time" },

  // Month 6
  { id: uid(), title: "Speak 30 mins (HelloTalk/Tandem)", month: 6, type: "daily" },
  { id: uid(), title: "Movie sans subtitles – 20 mins", month: 6, type: "daily" },
  { id: uid(), title: "Conditional & subjunctive (intro)", month: 6, type: "one-time" },
];

// ---------- storage shape ----------
// {
//   tasks: Task[]
//   doneOneTime: { [taskId]: true }
//   doneDaily: { [taskId]: { [yyyy-mm-dd]: true } }
// }

export default function FrenchLearningTrackerV1() {
  const [data, setData] = useState(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    const initial = {
      tasks: seedTasks,
      doneOneTime: {},
      doneDaily: {},
    };
    localStorage.setItem(LS_KEY, JSON.stringify(initial));
    return initial;
  });

  const [activeMonth, setActiveMonth] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today"); // today | all | pending | completed

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  // ---------- helpers ----------
  const toggleOneTime = (taskId) => {
    setData((d) => ({
      ...d,
      doneOneTime: {
        ...d.doneOneTime,
        [taskId]: !d.doneOneTime[taskId],
      },
    }));
  };

  const toggleDaily = (taskId, date = todayStr()) => {
    setData((d) => {
      const byDate = d.doneDaily[taskId] || {};
      const newByDate = { ...byDate, [date]: !byDate[date] };
      return {
        ...d,
        doneDaily: { ...d.doneDaily, [taskId]: newByDate },
      };
    });
  };

  const addTask = (payload) => {
    const t = { id: uid(), ...payload };
    setData((d) => ({ ...d, tasks: [t, ...d.tasks] }));
  };

  const removeTask = (taskId) => {
    setData((d) => ({
      ...d,
      tasks: d.tasks.filter((t) => t.id !== taskId),
      doneOneTime: Object.fromEntries(
        Object.entries(d.doneOneTime).filter(([k]) => k !== taskId)
      ),
      doneDaily: Object.fromEntries(
        Object.entries(d.doneDaily).filter(([k]) => k !== taskId)
      ),
    }));
  };

  const resetToday = () => {
    const day = todayStr();
    setData((d) => {
      const next = { ...d, doneDaily: { ...d.doneDaily } };
      for (const [taskId, dates] of Object.entries(d.doneDaily)) {
        if (!dates[day]) continue;
        const nd = { ...dates };
        delete nd[day];
        next.doneDaily[taskId] = nd;
      }
      return next;
    });
  };

  const markAllToday = (month) => {
    const day = todayStr();
    setData((d) => {
      const next = { ...d, doneDaily: { ...d.doneDaily } };
      d.tasks.filter((t) => t.month === month && t.type === "daily").forEach((t) => {
        const dates = d.doneDaily[t.id] || {};
        next.doneDaily[t.id] = { ...dates, [day]: true };
      });
      return next;
    });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `french-tracker-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.tasks) throw new Error("Invalid file");
        setData(parsed);
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // ---------- derived ----------
  const months = [1, 2, 3, 4, 5, 6];
  const today = todayStr();

  const visibleTasks = useMemo(() => {
    return data.tasks
      .filter((t) => t.month === activeMonth)
      .filter((t) => (search ? t.title.toLowerCase().includes(search.toLowerCase()) : true))
      .filter((t) => {
        if (filter === "all") return true;
        if (t.type === "one-time") {
          const done = !!data.doneOneTime[t.id];
          if (filter === "completed") return done;
          if (filter === "pending") return !done;
          // today -> show all one-time tasks
          return true;
        } else {
          const done = !!(data.doneDaily[t.id] && data.doneDaily[t.id][today]);
          if (filter === "completed") return done;
          if (filter === "pending") return !done;
          if (filter === "today") return true;
          return true;
        }
      })
      .sort((a, b) => (a.type === b.type ? 0 : a.type === "daily" ? -1 : 1));
  }, [data, activeMonth, search, filter, today]);

  const monthStats = useMemo(() => {
    const inMonth = data.tasks.filter((t) => t.month === activeMonth);
    const daily = inMonth.filter((t) => t.type === "daily");
    const oneTime = inMonth.filter((t) => t.type === "one-time");

    const dailyDoneToday = daily.filter((t) => data.doneDaily[t.id]?.[today]).length;
    const dailyPct = daily.length ? Math.round((dailyDoneToday / daily.length) * 100) : 0;

    const oneTimeDone = oneTime.filter((t) => data.doneOneTime[t.id]).length;
    const oneTimePct = oneTime.length ? Math.round((oneTimeDone / oneTime.length) * 100) : 0;

    const overallPct = Math.round((dailyPct + oneTimePct) / 2);

    return { dailyDoneToday, dailyTotal: daily.length, dailyPct, oneTimeDone, oneTimeTotal: oneTime.length, oneTimePct, overallPct };
  }, [data, activeMonth, today]);

  // simple streak = consecutive days with at least 1 daily task done in active month
  const streak = useMemo(() => {
    const dailyIds = data.tasks.filter((t) => t.month === activeMonth && t.type === "daily").map((t) => t.id);
    let s = 0;
    let d = new Date();
    for (;;) {
      const key = d.toLocaleDateString("en-CA");
      const dayDone = dailyIds.some((id) => data.doneDaily[id]?.[key]);
      if (dayDone) {
        s += 1;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return s;
  }, [data, activeMonth]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">French Learning Tracker</h1>
            <p className="text-sm text-slate-600">6-month roadmap • daily + one-time tasks • local save</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportJSON} className="px-3 py-2 rounded-xl bg-white shadow border hover:bg-slate-50">Export</button>
            <label className="px-3 py-2 rounded-xl bg-white shadow border cursor-pointer hover:bg-slate-50">
              Import
              <input type="file" className="hidden" accept="application/json" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Month Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-3 py-1.5 rounded-2xl border shadow-sm ${activeMonth === m ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100"}`}
            >
              Month {m}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Card title="Today's Daily Progress">
            <Progress value={monthStats.dailyPct} />
            <div className="text-xs text-slate-600 mt-1">{monthStats.dailyDoneToday}/{monthStats.dailyTotal} done</div>
          </Card>
          <Card title="One-time Progress">
            <Progress value={monthStats.oneTimePct} />
            <div className="text-xs text-slate-600 mt-1">{monthStats.oneTimeDone}/{monthStats.oneTimeTotal} done</div>
          </Card>
          <Card title="Overall">
            <div className="flex items-center justify-between">
              <Progress value={monthStats.overallPct} />
              <span className="ml-3 text-sm font-semibold">Streak: {streak}🔥</span>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex gap-2">
            <input
              className="flex-1 rounded-xl border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Search task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rounded-xl border bg-white px-3 py-2 shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => markAllToday(activeMonth)} className="px-3 py-2 rounded-xl bg-emerald-600 text-white shadow hover:bg-emerald-700">Mark all daily today</button>
            <button onClick={resetToday} className="px-3 py-2 rounded-xl bg-white border shadow hover:bg-slate-50">Reset today</button>
          </div>
        </div>

        {/* Add Task */}
        <AddTaskForm onAdd={(title, type) => addTask({ title, type, month: activeMonth })} />

        {/* Task List */}
        <div className="mt-4 grid gap-2">
          {visibleTasks.length === 0 && (
            <div className="text-sm text-slate-500">No tasks match.</div>
          )}
          {visibleTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-white border rounded-xl px-3 py-2 shadow-sm">
              <div className="flex items-center gap-3">
                {t.type === "daily" ? (
                  <input
                    type="checkbox"
                    checked={!!(data.doneDaily[t.id]?.[today])}
                    onChange={() => toggleDaily(t.id)}
                    className="size-4"
                    title="Mark today"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={!!data.doneOneTime[t.id]}
                    onChange={() => toggleOneTime(t.id)}
                    className="size-4"
                    title="Mark done"
                  />
                )}
                <div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-slate-500">{t.type === "daily" ? "Daily" : "One-time"} • Month {t.month}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {t.type === "daily" && (
                  <HistoryBadge dates={data.doneDaily[t.id]} />
                )}
                <button onClick={() => removeTask(t.id)} className="text-xs px-2 py-1 rounded-lg border bg-white hover:bg-slate-50">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer tip */}
        <div className="mt-6 text-xs text-slate-500">Tip: Edit seedTasks in file to customize your roadmap quickly.</div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <div className="text-sm font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-2 bg-slate-900" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("daily");

  return (
    <div className="bg-white border rounded-2xl p-3 shadow-sm">
      <div className="text-sm font-semibold mb-2">Add task to current month</div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="flex-1 rounded-xl border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Task title (e.g., 'Shadowing – 10 mins')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select className="rounded-xl border bg-white px-3 py-2 shadow-sm" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="one-time">One-time</option>
        </select>
        <button
          className="px-3 py-2 rounded-xl bg-slate-900 text-white shadow hover:bg-slate-800"
          onClick={() => {
            if (!title.trim()) return;
            onAdd(title.trim(), type);
            setTitle("");
            setType("daily");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function HistoryBadge({ dates }) {
  if (!dates) return <span className="text-xs text-slate-400">0d</span>;
  const keys = Object.keys(dates).filter((k) => dates[k]).sort();
  const last = keys[keys.length - 1];
  const count = keys.length;
  return (
    <span title={`Last: ${last || "-"}`} className="text-xs px-2 py-1 rounded-lg bg-slate-100 border">{count}d</span>
  );
}
