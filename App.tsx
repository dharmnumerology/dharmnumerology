
import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, CreditCard, Video, Award, LogOut, ChevronRight, Plus, Search, CheckCircle, 
  Clock, Menu, X, User as UserIcon, Home, ExternalLink, Download, AlertCircle, Share2, 
  Send, MessageCircle, Sparkles, Calendar, Star, Zap, Quote, Coins, History, Rocket, 
  Monitor, FileText, Filter, Printer, Database, ArrowRight, ShieldCheck, PlayCircle
} from 'lucide-react';
import { User, Course, Enrollment, UserRole, PaymentStatus } from './types';
import { mockUsers, mockCourses, mockEnrollments } from './data/mockData';
import { generateDailyInsight } from './services/gemini';
import { db } from './services/db';

// --- Shared UI Components ---

const Badge = ({ children, status }: { children?: React.ReactNode, status: string }) => {
  const colors: Record<string, string> = {
    PAID: 'bg-emerald-100 text-emerald-700',
    PENDING: 'bg-rose-100 text-rose-700',
    PARTIAL: 'bg-amber-100 text-amber-700',
    ACTIVE: 'bg-indigo-100 text-indigo-700',
    FREE: 'bg-cyan-100 text-cyan-700',
    UPCOMING: 'bg-violet-100 text-violet-700'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {children || status}
    </span>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center space-x-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

// --- View Components ---

const DashboardView = ({ isAdmin, currentUser, dailyInsight, stats }: any) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="brand-font text-3xl text-slate-900">Radhe Radhe, {currentUser.name}!</h1>
        <p className="text-slate-500 mt-1">Your cosmic portal for {isAdmin ? 'management' : 'learning'} is ready.</p>
      </div>
      <div className="flex items-center gap-3 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50">Today</div>
        <div className="px-4 py-2 text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4"><Users className="text-indigo-600" /></div>
        <div className="text-2xl font-black text-slate-800">{stats.students}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Students</div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4"><BookOpen className="text-emerald-600" /></div>
        <div className="text-2xl font-black text-slate-800">{stats.batches}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAdmin ? 'Live Batches' : 'My Courses'}</div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4"><Coins className="text-amber-600" /></div>
        <div className="text-2xl font-black text-slate-800">{isAdmin ? `₹${stats.revenue}` : stats.recordings}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAdmin ? 'Total Revenue' : 'Recordings'}</div>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4"><Award className="text-purple-600" /></div>
        <div className="text-2xl font-black text-slate-800">{stats.certificates}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certificates</div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
        <div className="relative z-10">
          <Badge status="UPCOMING">Mega Event</Badge>
          <h2 className="text-3xl font-bold mt-6 mb-4">Laal Kitab Masterclass 2025</h2>
          <p className="text-slate-400 max-w-md mb-8">Unlock ancient secrets and planetary remedies in our most requested advanced batch starting this January.</p>
          <button className="flex items-center gap-2 bg-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/40">
            Book My Slot <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <Sparkles className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-20 group-hover:rotate-12 transition-transform duration-1000" />
      </div>

      <div className="bg-amber-50 rounded-[3rem] p-8 border border-amber-100 relative overflow-hidden">
        <Quote className="absolute -top-4 -right-4 w-24 h-24 text-amber-200/40" />
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-amber-600 fill-amber-600" />
          <h3 className="text-xs font-bold text-amber-700 uppercase tracking-widest">Daily Cosmic Insight</h3>
        </div>
        <p className="text-slate-700 italic leading-relaxed font-medium relative z-10">"{dailyInsight || 'Connecting with the cosmic energies...'}"</p>
        <div className="mt-8 pt-6 border-t border-amber-200/50">
          <button className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            Share Insight <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Logic ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyInsight, setDailyInsight] = useState('');

  // App State
  const [users] = useState<User[]>(mockUsers);
  const [courses] = useState<Course[]>(mockCourses);
  const [enrollments] = useState<Enrollment[]>(mockEnrollments);

  useEffect(() => {
    generateDailyInsight().then(setDailyInsight);
    const saved = localStorage.getItem('dharm_user');
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('dharm_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dharm_user');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="bg-white rounded-[3.5rem] p-12 max-w-md w-full text-center relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
            <Award className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="brand-font text-4xl text-slate-800 mb-2">dharmnumerology</h1>
          <p className="text-slate-400 text-sm font-medium mb-10 italic">Your journey into mysticism begins here.</p>
          
          <div className="space-y-4">
            <button onClick={() => handleLogin(users[0])} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">
              Admin Console
            </button>
            <button onClick={() => handleLogin(users[1])} className="w-full bg-indigo-50 text-indigo-700 py-5 rounded-2xl font-bold hover:bg-indigo-100 transition-all">
              Student Portal
            </button>
          </div>
          <p className="mt-12 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Crafted for Spiritual Growth</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const stats = {
    students: users.filter(u => u.role === UserRole.STUDENT).length,
    batches: isAdmin ? courses.length : enrollments.filter(e => e.studentId === currentUser.id).length,
    revenue: enrollments.reduce((a, b) => a + b.amountPaid, 0),
    recordings: 12, // Mocked
    certificates: enrollments.filter(e => e.studentId === currentUser.id && e.certificateIssued).length
  };

  return (
    <div className="flex min-h-screen bg-[#fcfdfe]">
      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200"><Award className="w-6 h-6 text-white" /></div>
            <span className="brand-font font-bold text-2xl text-slate-800 tracking-tight">dharm</span>
          </div>
          
          <nav className="space-y-2 flex-1">
            <NavItem active={activeTab === 'dashboard'} icon={<Home className="w-5 h-5" />} label="Cosmic Desk" onClick={() => setActiveTab('dashboard')} />
            {isAdmin ? (
              <>
                <NavItem active={activeTab === 'students'} icon={<Users className="w-5 h-5" />} label="Student Circle" onClick={() => setActiveTab('students')} />
                <NavItem active={activeTab === 'courses'} icon={<BookOpen className="w-5 h-5" />} label="Batch Manager" onClick={() => setActiveTab('courses')} />
                <NavItem active={activeTab === 'accounts'} icon={<CreditCard className="w-5 h-5" />} label="Financials" onClick={() => setActiveTab('accounts')} />
              </>
            ) : (
              <>
                <NavItem active={activeTab === 'my-courses'} icon={<BookOpen className="w-5 h-5" />} label="My Wisdom" onClick={() => setActiveTab('my-courses')} />
                <NavItem active={activeTab === 'recordings'} icon={<PlayCircle className="w-5 h-5" />} label="Library" onClick={() => setActiveTab('recordings')} />
              </>
            )}
          </nav>

          <div className="pt-8 border-t border-slate-50 mt-auto">
            <div className="bg-slate-50 p-4 rounded-2xl mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-indigo-600">{currentUser.name[0]}</div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{currentUser.role}</p>
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 p-4 hover:text-rose-600 w-full transition-colors font-bold text-xs uppercase tracking-widest">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-14 overflow-y-auto">
        <header className="flex items-center justify-between mb-14 lg:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100"><Menu /></button>
          <div className="brand-font font-bold text-xl">dharm</div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl"></div>
        </header>

        {activeTab === 'dashboard' && <DashboardView isAdmin={isAdmin} currentUser={currentUser} dailyInsight={dailyInsight} stats={stats} />}
        {/* Placeholder for other views to keep code clean */}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center"><Zap className="text-slate-300 w-10 h-10" /></div>
            <h2 className="text-xl font-bold text-slate-800">Module Under Expansion</h2>
            <p className="text-slate-400 max-w-xs">We are aligning the stars to bring this section to your screen very soon.</p>
            <button onClick={() => setActiveTab('dashboard')} className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Back to Dashboard</button>
          </div>
        )}
      </main>
    </div>
  );
}
