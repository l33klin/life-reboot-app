import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight, Save, Download, RefreshCcw, Calendar, Image as ImageIcon } from 'lucide-react';
import domtoimage from 'dom-to-image-more';
import ArticleZh from './ArticleZh';

// --- Types ---
type Step = 'landing' | 'morning_1' | 'morning_2' | 'morning_3' | 'daytime' | 'evening_1' | 'evening_2' | 'evening_3' | 'dashboard' | 'article_zh';

interface AppData {
  painPoints: string;
  complaints: string;
  antiVisionLong: string;
  antiVisionCost: string;
  visionLong: string;
  identity: string;
  enemy: string;
  antiVisionShort: string;
  visionShort: string;
  oneYearGoal: string;
  oneMonthProject: string;
  dailyActions: string;
  constraints: string;
}

const initialData: AppData = {
  painPoints: '',
  complaints: '',
  antiVisionLong: '',
  antiVisionCost: '',
  visionLong: '',
  identity: '',
  enemy: '',
  antiVisionShort: '',
  visionShort: '',
  oneYearGoal: '',
  oneMonthProject: '',
  dailyActions: '',
  constraints: '',
};

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '' }: any) => {
  const baseStyle = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
    outline: "border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-100"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const TextArea = ({ value, onChange, placeholder, label }: any) => (
  <div className="w-full flex flex-col gap-2">
    {label && <label className="text-lg font-medium text-zinc-700">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[120px] p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none resize-y transition-all text-zinc-800 text-lg"
    />
  </div>
);

const Input = ({ value, onChange, placeholder, label }: any) => (
  <div className="w-full flex flex-col gap-2">
    {label && <label className="text-lg font-medium text-zinc-700">{label}</label>}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 text-lg"
    />
  </div>
);

// --- Main App ---

const stepProgress: Record<Step, number> = {
  landing: 0,
  article_zh: 0,
  morning_1: 15,
  morning_2: 30,
  morning_3: 45,
  daytime: 60,
  evening_1: 75,
  evening_2: 85,
  evening_3: 95,
  dashboard: 100
};

function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('lifeRebootData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  const [step, setStep] = useState<Step>(() => {
    const hash = window.location.hash.replace('#', '') as Step;
    if (hash && Object.keys(stepProgress).includes(hash)) {
      return hash;
    }
    const savedStep = localStorage.getItem('lifeRebootStep');
    return (savedStep as Step) || 'landing';
  });

  const dashboardRef = useRef<HTMLDivElement>(null);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Step;
      if (hash && Object.keys(stepProgress).includes(hash)) {
        setStep(hash);
      } else if (!hash) {
        setStep('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save data to local storage on change
  useEffect(() => {
    localStorage.setItem('lifeRebootData', JSON.stringify(data));
  }, [data]);

  // Save step to local storage and update URL hash
  useEffect(() => {
    localStorage.setItem('lifeRebootStep', step);
    if (window.location.hash.replace('#', '') !== step) {
      window.history.pushState(null, '', `#${step}`);
    }
  }, [step]);

  const updateData = (key: keyof AppData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = (next: Step) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(next);
  };

  const generateICS = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const createEvent = (hour: number, minute: number, title: string, desc: string) => {
      const start = new Date(year, month, date, hour, minute);
      const end = new Date(year, month, date, hour, minute + 10);

      const format = (d: Date) => d.getFullYear() +
        String(d.getMonth() + 1).padStart(2, '0') +
        String(d.getDate()).padStart(2, '0') + 'T' +
        String(d.getHours()).padStart(2, '0') +
        String(d.getMinutes()).padStart(2, '0') + '00';

      return `BEGIN:VEVENT\nDTSTART:${format(start)}\nDTEND:${format(end)}\nSUMMARY:${title}\nDESCRIPTION:${desc}\nEND:VEVENT`;
    };

    const events = [
      createEvent(11, 0, "灵魂拷问：我在逃避什么？", "我现在做的事情，是在逃避什么？"),
      createEvent(13, 30, "灵魂拷问：我人生的追求？", "如果有人拍下了我过去两小时的录像，他们会得出我从生活中想要什么的结论？"),
      createEvent(15, 15, "灵魂拷问：走向何方？", "我正在走向我讨厌的生活还是我想要的生活？"),
      createEvent(17, 0, "灵魂拷问：假装不重要？", "我假装不重要的最重要的事情是什么？"),
      createEvent(19, 30, "灵魂拷问：人设还是渴望？", "我今天做的哪些事是出于保护身份而不是真正的渴望？（提示：这是你做的大多数事情）"),
      createEvent(21, 0, "灵魂拷问：活力与死气？", "我今天什么时候感觉最充满活力？什么时候感觉最死气沉沉？"),
      createEvent(22, 0, "重启之日：夜晚总结", `带着你的答案回到网页进行夜晚总结。\\n\\n链接: ${window.location.href}`)
    ];

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Life Reboot App//CN\n${events.join('\n')}\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'life-reboot-reminders.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveImage = async () => {
    if (!dashboardRef.current) return;
    try {
      const scale = 2;
      const node = dashboardRef.current;
      
      // Temporarily add a class to fix the border issue and add padding during rendering
      node.classList.add('exporting-image');
      
      // Calculate new dimensions including padding (40px on all sides)
      const padding = 40;
      const width = node.offsetWidth + (padding * 2);
      const height = node.offsetHeight + (padding * 2);
      
      const dataUrl = await domtoimage.toPng(node, {
        height: height * scale,
        width: width * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
          padding: `${padding}px`,
          margin: '0',
          boxSizing: 'content-box'
        },
        bgcolor: '#fafafa' // matches zinc-50
      });
      
      node.classList.remove('exporting-image');
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'life-reboot-dashboard.png';
      link.click();
    } catch (err) {
      console.error('Failed to save image', err);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in pt-20">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900">
              重启之日
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              大多数新年决心都会失败，因为你只想改变行为，却不敢改变身份。<br/>
              准备好用一天时间重启你的人生了吗？
            </p>
            
            <div className="text-sm text-zinc-500 bg-zinc-100/50 inline-block px-4 py-2 rounded-full">
              💡 本站点的核心思路来源于 Dan Koe 的文章：
              <a 
                href="https://letters.thedankoe.com/p/how-to-fix-your-entire-life-in-1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-900 font-medium hover:underline ml-1"
              >
                How to fix your entire life in 1 day
              </a>
              <span className="mx-3 text-zinc-300">|</span>
              <button 
                onClick={() => nextStep('article_zh')}
                className="text-zinc-900 font-medium hover:underline"
              >
                阅读中文完整版
              </button>
            </div>

            <div className="p-6 bg-zinc-100 rounded-2xl text-left text-zinc-700 space-y-4 mt-8">
              <p className="font-medium">⚠️ 开始前请注意：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>本计划需要你投入今天完整的时间。</li>
                <li>请保持绝对诚实，所有数据仅保存在你的本地浏览器中。</li>
                <li>准备好键盘，深呼吸。</li>
              </ul>
            </div>
            <Button onClick={() => nextStep('morning_1')} className="w-full md:w-auto text-lg py-4 px-8 mx-auto mt-8">
              开始我的重启之日 <ArrowRight size={20} />
            </Button>
          </div>
        );

      case 'article_zh':
        return <ArticleZh onBack={() => nextStep('landing')} />;

      case 'morning_1':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-10">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">早晨 1/3：直面痛苦</div>
            <h2 className="text-3xl font-bold text-zinc-900">你习以为常的隐痛是什么？</h2>
            <p className="text-zinc-600">不是那种剧烈的痛苦，而是你已经学会忍受的、日复一日的不满。</p>
            
            <TextArea 
              value={data.painPoints} 
              onChange={(v: string) => updateData('painPoints', v)}
              placeholder="例如：每天下班后感到极度空虚，只能靠刷短视频麻痹自己..."
            />

            <h2 className="text-3xl font-bold text-zinc-900 pt-8">过去一年你抱怨最多、却从未改变的3件事是什么？</h2>
            <TextArea 
              value={data.complaints} 
              onChange={(v: string) => updateData('complaints', v)}
              placeholder="1. 薪水太低&#10;2. 身体越来越差&#10;3. 没有时间做自己喜欢的事"
            />

            <div className="flex justify-end pt-8">
              <Button onClick={() => nextStep('morning_2')}>下一步 <ChevronRight size={20} /></Button>
            </div>
          </div>
        );

      case 'morning_2':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-10">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">早晨 2/3：构建反向愿景 (Anti-Vision)</div>
            <h2 className="text-3xl font-bold text-zinc-900">如果5年内什么都不改变，描述一个普通的星期二。</h2>
            <p className="text-zinc-600">你在哪里醒来？身体感觉如何？脑子里想的第一件事是什么？晚上10点你是什么心情？</p>
            
            <TextArea 
              value={data.antiVisionLong} 
              onChange={(v: string) => updateData('antiVisionLong', v)}
              placeholder="早上被闹钟惊醒，带着疲惫去挤地铁。工作依然是那些毫无意义的破事..."
            />

            <h2 className="text-3xl font-bold text-zinc-900 pt-8">在你临终前，如果你选择了最安全的人生，你付出了什么代价？</h2>
            <TextArea 
              value={data.antiVisionCost} 
              onChange={(v: string) => updateData('antiVisionCost', v)}
              placeholder="我从未真正活过，我只是在扮演别人期望的角色..."
            />

            <div className="flex justify-between pt-8">
              <Button variant="secondary" onClick={() => nextStep('morning_1')}>上一步</Button>
              <Button onClick={() => nextStep('morning_3')}>下一步 <ChevronRight size={20} /></Button>
            </div>
          </div>
        );

      case 'morning_3':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-10">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">早晨 3/3：构建初步愿景</div>
            <h2 className="text-3xl font-bold text-zinc-900">抛开现实，3年后你真正想要的一天是怎样的？</h2>
            <p className="text-zinc-600">不要管现不现实。你想要什么？</p>
            
            <TextArea 
              value={data.visionLong} 
              onChange={(v: string) => updateData('visionLong', v)}
              placeholder="早上自然醒，喝杯咖啡，花两小时做自己的项目，下午去健身..."
            />

            <h2 className="text-3xl font-bold text-zinc-900 pt-8">为了让这种生活显得自然，你必须成为怎样的人？</h2>
            <div className="flex items-center gap-4 bg-zinc-100 p-6 rounded-xl">
              <span className="text-xl font-medium text-zinc-700 whitespace-nowrap">我是一个</span>
              <input 
                type="text"
                value={data.identity}
                onChange={(e) => updateData('identity', e.target.value)}
                placeholder="自律且充满创造力"
                className="w-full bg-transparent border-b-2 border-zinc-300 focus:border-zinc-900 outline-none px-2 py-1 text-xl font-bold text-zinc-900"
              />
              <span className="text-xl font-medium text-zinc-700 whitespace-nowrap">的人。</span>
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="secondary" onClick={() => nextStep('morning_2')}>上一步</Button>
              <Button onClick={() => nextStep('daytime')}>完成早晨任务 <ChevronRight size={20} /></Button>
            </div>
          </div>
        );

      case 'daytime':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in pt-20">
            <div className="w-24 h-24 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-8">
              <RefreshCcw size={40} className="animate-spin-slow" />
            </div>
            <h2 className="text-4xl font-black text-zinc-900">去生活，去感受你的自动驾驶模式。</h2>
            <p className="text-xl text-zinc-600 leading-relaxed">
              早晨的挖掘已经完成。现在，关掉这个页面，去过你平常的一天。<br/>
              但在今天，请在手机里设置以下几个闹钟，当闹钟响起时，问自己：
            </p>
            
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-left space-y-6 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="font-mono font-bold text-zinc-400 mt-1">11:00</div>
                <div className="text-lg text-zinc-800 font-medium">我现在做的事情，是在逃避什么？</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="font-mono font-bold text-zinc-400 mt-1">13:30</div>
                <div className="text-lg text-zinc-800 font-medium">如果有人拍下了我过去两小时的录像，他们会得出我从生活中想要什么的结论？</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="font-mono font-bold text-zinc-400 mt-1">15:15</div>
                <div className="text-lg text-zinc-800 font-medium">我正在走向我讨厌的生活还是我想要的生活？</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="font-mono font-bold text-zinc-400 mt-1">17:00</div>
                <div className="text-lg text-zinc-800 font-medium">我假装不重要的最重要的事情是什么？</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="font-mono font-bold text-zinc-400 mt-1">19:30</div>
                <div className="text-lg text-zinc-800 font-medium">我今天做的哪些事是出于保护身份而不是真正的渴望？（提示：这是你做的大多数事情）</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="font-mono font-bold text-zinc-400 mt-1">21:00</div>
                <div className="text-lg text-zinc-800 font-medium">我今天什么时候感觉最充满活力？什么时候感觉最死气沉沉？</div>
              </div>
            </div>

            <p className="text-lg font-bold text-zinc-900 pt-8">今晚 10 点，带着你的答案回到这里。</p>

            <div className="flex justify-center pt-4">
              <Button onClick={generateICS} variant="outline" className="w-full md:w-auto">
                <Calendar size={20} /> 添加提醒到日历 (.ics)
              </Button>
            </div>

            <div className="flex justify-center pt-8">
              <Button onClick={() => nextStep('evening_1')} className="w-full md:w-auto">
                我已经完成了白天的观察，进入夜晚 <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        );

      case 'evening_1':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-10">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">夜晚 1/3：锁定敌人</div>
            <h2 className="text-3xl font-bold text-zinc-900">经过今天的观察，阻碍你的真正内部模式或信念是什么？</h2>
            <p className="text-zinc-600">不是外部环境，不是别人，而是你内心的那个“敌人”。明确地叫出它的名字。</p>
            
            <TextArea 
              value={data.enemy} 
              onChange={(v: string) => updateData('enemy', v)}
              placeholder="例如：对失败的极度恐惧，导致我永远只敢做有把握的琐事..."
            />

            <div className="flex justify-between pt-8">
              <Button variant="secondary" onClick={() => nextStep('daytime')}>上一步</Button>
              <Button onClick={() => nextStep('evening_2')}>下一步 <ChevronRight size={20} /></Button>
            </div>
          </div>
        );

      case 'evening_2':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-10">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">夜晚 2/3：极致压缩</div>
            <h2 className="text-3xl font-bold text-zinc-900">写下一句话的反向愿景</h2>
            <p className="text-zinc-600">浓缩你早晨写下的恐惧。这句话应该让你读起来感到刺痛。</p>
            
            <Input 
              value={data.antiVisionShort} 
              onChange={(v: string) => updateData('antiVisionShort', v)}
              placeholder="我绝对不让我的生活变成：每天在格子间里等死，抱怨社会不公。"
            />

            <h2 className="text-3xl font-bold text-zinc-900 pt-8">写下一句话的愿景</h2>
            <p className="text-zinc-600">浓缩你早晨写下的渴望。这是你正在构建的未来。</p>
            
            <Input 
              value={data.visionShort} 
              onChange={(v: string) => updateData('visionShort', v)}
              placeholder="我正在构建：一个完全掌控自己时间、靠创造力生存的自由人生。"
            />

            <div className="flex justify-between pt-8">
              <Button variant="secondary" onClick={() => nextStep('evening_1')}>上一步</Button>
              <Button onClick={() => nextStep('evening_3')}>下一步 <ChevronRight size={20} /></Button>
            </div>
          </div>
        );

      case 'evening_3':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-10">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">夜晚 3/3：设定镜头</div>
            
            <Input 
              label="1年目标 (主线任务)"
              value={data.oneYearGoal} 
              onChange={(v: string) => updateData('oneYearGoal', v)}
              placeholder="一年后必须发生什么，才能证明你打破了旧模式？"
            />

            <Input 
              label="1个月项目 (Boss 战)"
              value={data.oneMonthProject} 
              onChange={(v: string) => updateData('oneMonthProject', v)}
              placeholder="这个月你需要学习什么技能，或完成什么具体项目？"
            />

            <TextArea 
              label="每日行动 (日常任务)"
              value={data.dailyActions} 
              onChange={(v: string) => updateData('dailyActions', v)}
              placeholder="明天你要做的2-3件具体的事是什么？"
            />

            <Input 
              label="约束条件 (游戏规则)"
              value={data.constraints} 
              onChange={(v: string) => updateData('constraints', v)}
              placeholder="为了实现愿景，你绝对不牺牲的东西是什么？（如：睡眠、健康）"
            />

            <div className="flex justify-between pt-8">
              <Button variant="secondary" onClick={() => nextStep('evening_2')}>上一步</Button>
              <Button onClick={() => nextStep('dashboard')}>生成玩家面板 <Save size={20} /></Button>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="max-w-4xl mx-auto animate-fade-in pt-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 print:hidden">
              <div>
                <h1 className="text-4xl font-black text-zinc-900">玩家面板</h1>
                <p className="text-zinc-500 mt-2">你的生活已经游戏化。这是你的角色卡。</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Button variant="outline" onClick={handleSaveImage} className="flex-1 md:flex-none">
                  <ImageIcon size={18} /> 保存为图片
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="flex-1 md:flex-none">
                  <Download size={18} /> 保存为 PDF
                </Button>
              </div>
            </div>

            <div ref={dashboardRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:scale-[0.85] print:origin-top">
              {/* Vision Card */}
              <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl print:mb-4 print:break-inside-avoid">
                <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-2">👑 胜利条件 (Vision)</div>
                <div className="text-2xl font-bold leading-snug">{data.visionShort || '未设定'}</div>
                
                <div className="mt-8 pt-8 border-t border-zinc-800">
                  <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-2">身份认同</div>
                  <div className="text-xl">我是一个 <span className="font-bold text-white border-b-2 border-zinc-700 pb-1">{data.identity || '___'}</span> 的人。</div>
                </div>
              </div>

              {/* Anti-Vision Card */}
              <div className="bg-red-50 text-red-900 p-8 rounded-3xl border border-red-100 print:mb-4 print:break-inside-avoid">
                <div className="text-red-400 text-sm font-bold tracking-widest uppercase mb-2">🔥 失败的代价 (Anti-Vision)</div>
                <div className="text-xl font-medium leading-snug">{data.antiVisionShort || '未设定'}</div>
                
                <div className="mt-8 pt-8 border-t border-red-200">
                  <div className="text-red-400 text-sm font-bold tracking-widest uppercase mb-2">真正的敌人</div>
                  <div className="text-lg">{data.enemy || '未设定'}</div>
                </div>
              </div>

              {/* Quests */}
              <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4 print:mb-4 print:break-inside-avoid">
                <div>
                  <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-3">🗺️ 主线任务 (1年目标)</div>
                  <div className="text-lg font-medium text-zinc-800">{data.oneYearGoal || '未设定'}</div>
                </div>
                <div>
                  <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-3">👹 Boss 战 (1个月项目)</div>
                  <div className="text-lg font-medium text-zinc-800">{data.oneMonthProject || '未设定'}</div>
                </div>
                <div>
                  <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-3">🛡️ 游戏规则 (约束条件)</div>
                  <div className="text-lg font-medium text-zinc-800">{data.constraints || '未设定'}</div>
                </div>
              </div>

              {/* Daily Actions */}
              <div className="md:col-span-2 bg-zinc-100 p-8 rounded-3xl border border-zinc-200 print:break-inside-avoid">
                <div className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-4">⚔️ 日常任务 (每日行动)</div>
                <div className="text-xl font-medium text-zinc-900 whitespace-pre-wrap leading-relaxed">
                  {data.dailyActions || '未设定'}
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center print:hidden flex justify-center gap-4">
              <Button variant="secondary" onClick={() => nextStep('evening_3')}>返回修改</Button>
              <Button variant="outline" onClick={() => {
                if (window.confirm('确定要清空所有数据并重新开始吗？')) {
                  setData(initialData);
                  nextStep('landing');
                }
              }}>清空并重新开始</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans px-6 py-12 selection:bg-zinc-900 selection:text-white pb-24">
      {/* Progress Bar */}
      {step !== 'landing' && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-zinc-200 z-50 print:hidden">
          <div 
            className="h-full bg-zinc-900 transition-all duration-500 ease-out"
            style={{ width: `${stepProgress[step]}%` }}
          />
        </div>
      )}
      
      {renderStep()}
    </div>
  );
}

export default App;