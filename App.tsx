
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Video, 
  Award, 
  LogOut, 
  ChevronRight,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Menu,
  X,
  User as UserIcon,
  Home,
  ExternalLink,
  Download,
  AlertCircle,
  Share2,
  Send,
  MessageCircle,
  Instagram,
  Youtube,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  Star,
  Copy,
  Link as LinkIcon,
  Bell,
  Zap,
  Quote,
  TrendingUp,
  PieChart,
  UserCheck,
  PlayCircle,
  Cloud,
  Cpu,
  Globe,
  Info,
  ShieldAlert,
  Settings,
  HelpCircle,
  Lock,
  Activity,
  RefreshCw,
  Code,
  HardDrive,
  BarChart3,
  TrendingDown,
  Coins,
  History,
  Check,
  Rocket,
  AlertTriangle,
  Monitor,
  FileText,
  Filter,
  Printer,
  PhoneCall,
  Upload,
  Database,
  CloudLightning,
  CloudCheck
} from 'lucide-react';
import { User, Course, Enrollment, UserRole, PaymentStatus, Recording } from './types';
import { mockUsers, mockCourses, mockEnrollments } from './data/mockData';
import { generateDailyInsight, generateCertificateQuote } from './services/gemini';
import { db } from './services/db';

// --- Shared Components ---

const Badge = ({ children, status }: { children?: React.ReactNode, status: string }) => {
  const colors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-700',
    PENDING: 'bg-red-100 text-red-700',
    PARTIAL: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    FREE: 'bg-emerald-100 text-emerald-700',
    UPCOMING: 'bg-amber-100 text-amber-700',
    URGENT: 'bg-rose-100 text-rose-700',
    ZERO_COST: 'bg-emerald-500 text-white'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {children || status}
    </span>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

// --- View Components ---

const RegistrationForm = ({ courses, onBack, onRegister }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    courseId: courses.find((c: any) => !c.isFree && !c.isUpcoming)?.id || '',
    amount: courses.find((c: any) => !c.isFree && !c.isUpcoming)?.price || 0
  });

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
      <h2 className="brand-font text-2xl text-slate-800 mb-6">Course Enrollment</h2>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Full Name</label>
          <input type="text" className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500" placeholder="Rahul Sharma" onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Email</label>
          <input type="email" className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500" placeholder="rahul@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Phone</label>
            <input type="tel" className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500" placeholder="9876543210" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">DOB</label>
            <input type="date" className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, dob: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Select Batch</label>
          <select className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500" value={formData.courseId} onChange={e => {
            const course = courses.find((c: any) => c.id === e.target.value);
            setFormData({...formData, courseId: e.target.value, amount: course?.price || 0});
          }}>
            {courses.filter((c: any) => !c.isFree && !c.isUpcoming).map((c: any) => (
              <option key={c.id} value={c.id}>{c.title} - ₹{c.price}</option>
            ))}
          </select>
        </div>
        <div className="pt-4 space-y-3">
          <button onClick={() => onRegister(formData)} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
            Proceed to Payment <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={onBack} className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600">Back to Home</button>
        </div>
      </div>
    </div>
  );
};

const WebinarJoiningForm = ({ courses, onBack, onJoin }: any) => {
  const webinar = courses.find((c: any) => c.isFree);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: webinar?.id || ''
  });

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full border-2 border-emerald-50">
      <div className="mb-6">
        <Badge status="FREE">Upcoming Live Session</Badge>
        <h2 className="brand-font text-2xl text-slate-800 mt-2">{webinar?.title || 'Free Webinar'}</h2>
      </div>
      <div className="space-y-4">
        <input type="text" className="w-full p-4 bg-emerald-50/30 border-0 rounded-2xl" placeholder="Your Name" onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" className="w-full p-4 bg-emerald-50/30 border-0 rounded-2xl" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="tel" className="w-full p-4 bg-emerald-50/30 border-0 rounded-2xl" placeholder="WhatsApp Number" onChange={e => setFormData({...formData, phone: e.target.value})} />
        <button onClick={() => onJoin(formData)} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-emerald-100">Join Webinar Now</button>
        <button onClick={onBack} className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
      </div>
    </div>
  );
};

const PaymentSimulation = ({ data, course, onSuccess }: any) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <CreditCard className="w-10 h-10 text-indigo-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Secure Payment</h2>
      <p className="text-slate-500 text-sm mb-8">Course: <span className="font-semibold text-slate-700">{course?.title}</span></p>
      
      <div className="bg-slate-50 p-6 rounded-3xl mb-8">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</div>
        <div className="text-4xl font-bold text-slate-800">₹{course?.price}</div>
      </div>

      <button 
        disabled={processing}
        onClick={handlePay}
        className={`w-full p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${processing ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-xl'}`}
      >
        {processing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
        {processing ? 'Processing...' : 'Pay with Razorpay'}
      </button>
      <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Encrypted & Secure Transaction</p>
    </div>
  );
};

const DashboardView = ({ isAdmin, currentUser, users, courses, enrollments, dailyInsight, onRestore, dbStatus }: any) => {
  const activeStudents = users.filter((u: any) => u.role === UserRole.STUDENT).length;
  const totalRevenue = enrollments.reduce((acc: number, curr: any) => acc + curr.amountPaid, 0);
  const activeBatches = courses.filter((c: any) => !c.isUpcoming && !c.isFree).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {currentUser.name}!</h1>
          <p className="text-slate-500 mt-1">Here is what's happening in dharmnumerology today.</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${dbStatus === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {dbStatus === 'connected' ? <CloudCheck className="w-3.5 h-3.5" /> : <CloudLightning className="w-3.5 h-3.5" />}
                {dbStatus === 'connected' ? 'Neon Cloud Active' : 'Local Storage Only'}
             </div>
             <button onClick={() => alert("Cloud Sync Verified for dharmnumerology.")} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
              <Database className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Active Students" value={activeStudents} icon={Users} color="bg-indigo-600" trend="+12%" />
          <StatCard label="Total Revenue" value={`₹${totalRevenue}`} icon={Coins} color="bg-emerald-600" trend="+24%" />
          <StatCard label="Live Batches" value={activeBatches} icon={BookOpen} color="bg-amber-600" />
          <StatCard label="Completion Rate" value="88%" icon={CheckCircle} color="bg-purple-600" trend="+5%" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Enrolled Batches" value={enrollments.filter((e: any) => e.studentId === currentUser.id).length} icon={BookOpen} color="bg-indigo-600" />
          <StatCard label="Recordings Available" value="24" icon={Video} color="bg-emerald-600" />
          <StatCard label="Certificates Earned" value={enrollments.filter((e: any) => e.studentId === currentUser.id && e.certificateIssued).length} icon={Award} color="bg-purple-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
            <div className="relative z-10">
              <Badge status="ZERO_COST">Special Announcement</Badge>
              <h3 className="text-2xl font-bold mt-4 mb-2">Advanced Prediction Workshop 2025</h3>
              <p className="text-indigo-100 text-sm max-w-md">New batch starting Jan 15th for dharmnumerology students.</p>
              <button className="mt-6 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">Register Interest</button>
            </div>
            <Rocket className="absolute -bottom-10 -right-10 w-64 h-64 text-indigo-500/20" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
              <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest">View History</button>
            </div>
            <div className="space-y-6">
              {enrollments.slice(-3).reverse().map((e: any, i: number) => {
                const s = users.find(u => u.id === e.studentId);
                const c = courses.find(co => co.id === e.courseId);
                return (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <History className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{s?.name} enrolled in {c?.title}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recently</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-200 rounded-lg text-amber-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Daily Insight</h3>
            </div>
            <p className="text-slate-700 italic leading-relaxed text-sm">"{dailyInsight || 'Generating cosmic wisdom for dharmnumerology...'}"</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Links</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">WhatsApp Group</span>
                <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Join Live Class</span>
                <Video className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Help & Support</span>
                <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Root Component ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<'landing' | 'register' | 'payment' | 'webinar-join'>('landing');
  const [dbStatus, setDbStatus] = useState<'connected' | 'local' | 'syncing'>('local');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('dharm_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('dharm_enrollments');
    return saved ? JSON.parse(saved) : mockEnrollments;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('dharm_courses');
    return saved ? JSON.parse(saved) : mockCourses;
  });

  const [dailyInsight, setDailyInsight] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tempRegData, setTempRegData] = useState<any>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  useEffect(() => {
    const checkDB = async () => {
      const result = await db.execute("SELECT 1");
      setDbStatus(result ? 'connected' : 'local');
    };
    checkDB();
    generateDailyInsight().then(setDailyInsight);
  }, []);

  useEffect(() => {
    localStorage.setItem('dharm_users', JSON.stringify(users));
    localStorage.setItem('dharm_enrollments', JSON.stringify(enrollments));
    localStorage.setItem('dharm_courses', JSON.stringify(courses));
    if (dbStatus === 'connected') db.syncToCloud({ users, enrollments, courses });
  }, [users, enrollments, courses, dbStatus]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('dharm_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dharm_user');
    setActiveTab('dashboard');
    setView('landing');
  };

  const handleRegistration = (data: any) => {
    setTempRegData(data);
    setView('payment');
  };

  const handlePaymentSuccess = () => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: tempRegData.name,
      email: tempRegData.email,
      phone: tempRegData.phone,
      role: UserRole.STUDENT,
      joiningDate: new Date().toISOString().split('T')[0]
    };
    const newEn: Enrollment = {
      id: `e${Date.now()}`,
      studentId: newUser.id,
      courseId: tempRegData.courseId,
      paymentStatus: PaymentStatus.PAID,
      amountPaid: tempRegData.amount,
      totalAmount: tempRegData.amount,
      isCompleted: false,
      certificateIssued: false
    };
    setUsers([...users, newUser]);
    setEnrollments([...enrollments, newEn]);
    handleLogin(newUser);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        {view === 'landing' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-amber-500"></div>
            <div className="mb-10">
              <Award className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h1 className="brand-font text-3xl text-slate-800 mb-1">dharmnumerology</h1>
              <p className="text-slate-500 text-xs italic font-medium">Path to Cosmic Wisdom</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => setView('register')} className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold flex flex-col items-center hover:bg-indigo-700 transition-all">
                <span>Enroll in Masterclass</span>
                <span className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Paid Certification</span>
              </button>
              <button onClick={() => setView('webinar-join')} className="w-full bg-emerald-50 text-emerald-600 p-5 rounded-2xl font-bold flex flex-col items-center hover:bg-emerald-100 transition-all border border-emerald-100">
                <span>Join Free Webinar</span>
                <span className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Limited Slots</span>
              </button>
              <div className="flex gap-4 pt-6 border-t">
                <button onClick={() => handleLogin(users[0])} className="flex-1 bg-slate-50 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100">Admin Login</button>
                <button onClick={() => handleLogin(users[1])} className="flex-1 bg-slate-50 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100">Student Portal</button>
              </div>
            </div>
          </div>
        )}
        {view === 'register' && <RegistrationForm courses={courses} onBack={() => setView('landing')} onRegister={handleRegistration} />}
        {view === 'webinar-join' && <WebinarJoiningForm courses={courses} onBack={() => setView('landing')} onJoin={handleLogin} />}
        {view === 'payment' && <PaymentSimulation data={tempRegData} course={courses.find(c => c.id === tempRegData.courseId)} onSuccess={handlePaymentSuccess} />}
      </div>
    );
  }

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-600 p-2 rounded-lg"><Award className="w-5 h-5 text-white" /></div>
            <span className="brand-font text-lg font-bold text-slate-800">dharmnumerology</span>
          </div>
          <nav className="space-y-1 flex-1">
            <NavItem active={activeTab === 'dashboard'} icon={<Home className="w-5 h-5" />} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
            {isAdmin ? (
              <>
                <NavItem active={activeTab === 'students'} icon={<Users className="w-5 h-5" />} label="Students" onClick={() => setActiveTab('students')} />
                <NavItem active={activeTab === 'courses'} icon={<BookOpen className="w-5 h-5" />} label="Batches" onClick={() => setActiveTab('courses')} />
              </>
            ) : (
              <>
                <NavItem active={activeTab === 'my-courses'} icon={<BookOpen className="w-5 h-5" />} label="My Learning" onClick={() => setActiveTab('my-courses')} />
                <NavItem active={activeTab === 'recordings'} icon={<Video className="w-5 h-5" />} label="Class Records" onClick={() => setActiveTab('recordings')} />
              </>
            )}
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-600 p-4 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
           <button className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
           <div className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-slate-400">dharmnumerology Cloud Console</div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-800">{currentUser.name}</div>
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{currentUser.role}</div>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">{currentUser.name[0]}</div>
           </div>
        </header>
        <DashboardView 
          isAdmin={isAdmin} 
          currentUser={currentUser} 
          users={users} 
          courses={courses} 
          enrollments={enrollments} 
          dailyInsight={dailyInsight} 
          dbStatus={dbStatus} 
        />
      </main>
    </div>
  );
}
