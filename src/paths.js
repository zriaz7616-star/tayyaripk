// Starter data. Stage 3 moves this into Firestore (boards / universities / courses) so the admin panel can edit it.
export const PATHS = [
  { id: 'school', en: 'School', ur: 'اسکول', icon: '🏫' },
  { id: 'college', en: 'College', ur: 'کالج', icon: '🎓' },
  { id: 'uni', en: 'University', ur: 'یونیورسٹی', icon: '🏛️' },
  { id: 'test', en: 'Entry tests', ur: 'داخلہ ٹیسٹ', icon: '📝' },
  { id: 'jobs', en: 'Jobs & services', ur: 'ملازمتیں اور خدمات', icon: '🎖️' }
]
const B = ['BISE Lahore', 'BISE Gujranwala', 'BISE Rawalpindi', 'BISE Faisalabad', 'BISE Multan', 'BISE Karachi', 'BISE Peshawar', 'BISE Quetta', 'Federal Board', 'AKU-EB']
const TECH = ['PBTE', 'SBTE', 'KP BTE']
export const ITEMS = [
  { p: 'school', n: 'Matric – Science', b: B },
  { p: 'school', n: 'Matric – Arts', b: B },
  { p: 'school', n: 'O Level', b: ['Cambridge'] },
  { p: 'college', n: 'FA', b: B.filter(x => x !== 'AKU-EB') },
  { p: 'college', n: 'FSc Pre-Medical', b: B },
  { p: 'college', n: 'FSc Pre-Engineering', b: B },
  { p: 'college', n: 'ICS', b: B.filter(x => x !== 'AKU-EB') },
  { p: 'college', n: 'ICom', b: B.filter(x => x !== 'AKU-EB') },
  { p: 'college', n: 'A Level', b: ['Cambridge'] },
  { p: 'college', n: 'DAE', b: TECH },
  { p: 'uni', n: 'NUST', c: ['Islamabad'], f: ['Engineering', 'Computer Science', 'Business'] },
  { p: 'uni', n: 'LUMS', c: ['Lahore'], f: ['Business', 'Computer Science'] },
  { p: 'uni', n: 'UET Lahore', c: ['Lahore'], f: ['Engineering'] },
  { p: 'uni', n: 'GIKI', c: ['Swabi'], f: ['Engineering', 'Computer Science'] },
  { p: 'uni', n: 'FAST-NUCES', c: ['Islamabad', 'Lahore', 'Karachi', 'Peshawar'], f: ['Computer Science', 'Engineering', 'Business'] },
  { p: 'uni', n: 'COMSATS University', c: ['Islamabad', 'Lahore'], f: ['Computer Science', 'Engineering', 'Business'] },
  { p: 'uni', n: 'Bahria University', c: ['Islamabad', 'Karachi', 'Lahore'], f: ['Computer Science', 'Engineering', 'Business'] },
  { p: 'uni', n: 'University of the Punjab', c: ['Lahore'], f: ['General'] },
  { p: 'uni', n: 'University of Peshawar', c: ['Peshawar'], f: ['General'] },
  { p: 'uni', n: 'IBA Karachi', c: ['Karachi'], f: ['Business', 'Computer Science'] },
  { p: 'uni', n: 'NED University', c: ['Karachi'], f: ['Engineering'] },
  { p: 'uni', n: 'Aga Khan University', c: ['Karachi'], f: ['Medicine'] },
  { p: 'uni', n: 'Dow University of Health Sciences', c: ['Karachi'], f: ['Medicine'] },
  { p: 'uni', n: 'King Edward Medical University', c: ['Lahore'], f: ['Medicine'] },
  ...['MDCAT', 'ECAT', 'NTS NAT', 'SAT', 'GAT'].map(n => ({ p: 'test', n })),
  ...['CSS', 'PMS', 'PPSC / FPSC', 'Army – Long Course', 'Army – PMA', 'Navy', 'PAF', 'Police'].map(n => ({ p: 'jobs', n }))
]
