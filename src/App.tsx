import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import {
  Activity, AlertTriangle, ArrowDown, Bell, Check, ChevronDown, ChevronRight,
  CircleHelp, Clock3, Crosshair, Download, Flame, Gauge, Layers3, MapPin,
  Maximize2, Menu, MoreHorizontal, Radio, Search, ShieldCheck, Siren, Wifi,
  X,
} from 'lucide-react';
import type { ThreeEvent } from '@react-three/fiber';
import type { ReactNode } from 'react';

type DeviceStatus = '正常' | '故障' | '待巡检' | '即将到期';
type Device = { id: string; name: string; type: string; location: string; status: DeviceStatus; battery: string; lastCheck: string; position: [number, number, number] };

const initialDevices: Device[] = [
  { id: 'F-001', name: '手提式干粉灭火器', type: '灭火器', location: 'A栋 · 一层 · 生产车间', status: '正常', battery: '100%', lastCheck: '今天 09:12', position: [-4.7, 0.52, -2.6] },
  { id: 'H-008', name: '室内消火栓', type: '消火栓', location: 'A栋 · 一层 · 东侧通道', status: '正常', battery: '在线', lastCheck: '今天 08:46', position: [-1.6, 0.57, -2.65] },
  { id: 'S-014', name: '光电感烟探测器', type: '烟感', location: 'A栋 · 二层 · 仓储区', status: '故障', battery: '离线', lastCheck: '昨天 18:30', position: [2.4, 1.8, -1.5] },
  { id: 'P-022', name: '自动喷淋末端试水装置', type: '喷淋', location: 'A栋 · 一层 · 包装区', status: '待巡检', battery: '在线', lastCheck: '3天前', position: [4.6, 0.52, -2.55] },
  { id: 'F-037', name: '手提式二氧化碳灭火器', type: '灭火器', location: 'B栋 · 一层 · 配电室', status: '即将到期', battery: '92%', lastCheck: '昨天 14:05', position: [-4.5, 0.52, 2.3] },
  { id: 'A-003', name: '火灾报警控制器', type: '报警主机', location: 'B栋 · 一层 · 消控室', status: '正常', battery: '在线', lastCheck: '今天 10:04', position: [0, 0.7, 2.15] },
  { id: 'H-019', name: '室外消火栓', type: '消火栓', location: '厂区 · 北门入口', status: '正常', battery: '在线', lastCheck: '今天 07:55', position: [4.5, 0.55, 2.35] },
];

const statusClass: Record<DeviceStatus, string> = { 正常: 'ok', 故障: 'danger', 待巡检: 'warning', 即将到期: 'soon' };
const statusOptions: Array<'全��' | DeviceStatus> = ['全部', '故障', '待巡检', '即将到期', '正常'];

function DeviceMarker({ device, selected, onSelect }: { device: Device; selected: boolean; onSelect: () => void }) {
  const color = device.status === '故障' ? '#ff5d63' : device.status === '待巡检' ? '#ffba5b' : device.status === '即将到期' ? '#ffd166' : '#27d8a0';
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(); };
  return (
    <group position={device.position} onClick={click}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[selected ? 0.19 : 0.14, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.29, 20, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.72, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      {selected && <Html position={[0, 1.05, 0]} center distanceFactor={10}>
        <div className="map-tooltip"><span className={`status-dot ${statusClass[device.status]}`} />{device.id} · {device.type}</div>
      </Html>}
    </group>
  );
}

function Building({ children }: { children: ReactNode }) {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]} receiveShadow>
      <planeGeometry args={[13, 8]} /><meshStandardMaterial color="#172b38" roughness={0.88} />
    </mesh>
    <gridHelper args={[13, 26, '#29424d', '#203641']} position={[0, -0.04, 0]} />
    {/* Low walls keep the equipment visible while suggesting the factory footprint. */}
    <mesh position={[0, 0.48, -3.8]}><boxGeometry args={[12.8, 0.95, 0.12]} /><meshStandardMaterial color="#344c58" transparent opacity={0.72} /></mesh>
    <mesh position={[-6.35, 0.48, 0]}><boxGeometry args={[0.12, 0.95, 7.7]} /><meshStandardMaterial color="#344c58" transparent opacity={0.72} /></mesh>
    <mesh position={[6.35, 0.48, 0]}><boxGeometry args={[0.12, 0.95, 7.7]} /><meshStandardMaterial color="#344c58" transparent opacity={0.72} /></mesh>
    <mesh position={[0, 0.48, 3.8]}><boxGeometry args={[12.8, 0.95, 0.12]} /><meshStandardMaterial color="#344c58" transparent opacity={0.72} /></mesh>
    <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.08, 0.7, 7.5]} /><meshStandardMaterial color="#3b5965" transparent opacity={0.7} /></mesh>
    <mesh position={[-3.15, 0.35, 0]}><boxGeometry args={[0.08, 0.7, 7.5]} /><meshStandardMaterial color="#3b5965" transparent opacity={0.7} /></mesh>
    <mesh position={[3.15, 0.35, 0]}><boxGeometry args={[0.08, 0.7, 7.5]} /><meshStandardMaterial color="#3b5965" transparent opacity={0.7} /></mesh>
    {/* Work cells / production equipment */}
    {[-4.7, -1.6, 1.6, 4.7].map((x, i) => <group key={x} position={[x, 0, i < 2 ? -1.25 : 1.25]}>
      <mesh position={[0, 0.44, 0]} castShadow><boxGeometry args={[1.65, 0.88, 1.35]} /><meshStandardMaterial color={i % 2 ? '#294553' : '#304d59'} /></mesh>
      <mesh position={[0, 0.91, 0]}><boxGeometry args={[1.72, 0.07, 1.42]} /><meshStandardMaterial color="#45616a" /></mesh>
      <mesh position={[0, 1.15, 0]}><boxGeometry args={[1.2, 0.04, 0.04]} /><meshStandardMaterial color="#25bfa0" emissive="#25bfa0" emissiveIntensity={0.3} /></mesh>
    </group>)}
    <mesh position={[0, 0.42, 0]}><boxGeometry args={[1.9, 0.84, 1.2]} /><meshStandardMaterial color="#213b48" /></mesh>
    <mesh position={[0, 0.88, 0]}><boxGeometry args={[1.96, 0.06, 1.26]} /><meshStandardMaterial color="#385561" /></mesh>
    {children}
  </group>;
}

function TwinScene({ devices, selected, setSelected }: { devices: Device[]; selected: string; setSelected: (id: string) => void }) {
  return <Canvas camera={{ position: [10, 10, 13], fov: 42 }} dpr={[1, 1.6]} shadows>
    <color attach="background" args={['#101e29']} />
    <ambientLight intensity={1.35} />
    <directionalLight position={[5, 10, 7]} intensity={2.2} castShadow />
    <pointLight position={[-6, 5, -4]} color="#1c9a98" intensity={18} distance={18} />
    <Building>{devices.map(device => <DeviceMarker key={device.id} device={device} selected={selected === device.id} onSelect={() => setSelected(device.id)} />)}</Building>
    <OrbitControls makeDefault enableDamping minDistance={8} maxDistance={25} maxPolarAngle={Math.PI / 2.08} target={[0, 0.1, 0]} />
  </Canvas>;
}

function StatCard({ icon, label, value, note, tone }: { icon: ReactNode; label: string; value: string; note: string; tone: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div><div className={`stat-trend ${tone}`}>↗</div></div>;
}

export default function App() {
  const [devices, setDevices] = useState(initialDevices);
  const [selectedId, setSelectedId] = useState('S-014');
  const [filter, setFilter] = useState<'全部' | DeviceStatus>('全部');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDetail, setShowDetail] = useState(true);
  const [activeNav, setActiveNav] = useState('数字孪生');
  const [notice, setNotice] = useState('');
  const selectedDevice = devices.find(device => device.id === selectedId) ?? devices[0];
  const filteredDevices = useMemo(() => devices.filter(device => (filter === '全部' || device.status === filter) && `${device.id}${device.name}${device.type}${device.location}`.toLowerCase().includes(query.toLowerCase())), [devices, filter, query]);
  const counts = useMemo(() => ({ total: devices.length, fault: devices.filter(d => d.status === '故障').length, inspect: devices.filter(d => d.status === '待巡检').length, due: devices.filter(d => d.status === '即将到期').length }), [devices]);
  const toast = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };
  const acknowledge = () => { setDevices(current => current.map(d => d.id === selectedId && d.status === '故障' ? { ...d, status: '待巡检' } : d)); toast(`${selectedId} 已创建处置工单`); };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Flame size={20} fill="currentColor" /></div><div><strong>安消云<span>·</span>数字孪生</strong><small>FACTORY FIRE SAFETY PLATFORM</small></div></div>
      <nav className="main-nav"><button className="mobile-menu"><Menu size={18}/></button>{['数字孪生', '设备管理', '巡检管理', '告警中心', '统计分析'].map(item => <button key={item} className={activeNav === item ? 'nav-active' : ''} onClick={() => setActiveNav(item)}>{item}{item === '告警中心' && <i className="nav-count">2</i>}</button>)}</nav>
      <div className="top-actions"><span className="connection"><i />系统运行正常</span><button className="icon-button" aria-label="通知" onClick={() => toast('当前有 2 条待处理告警')}><Bell size={18}/><i className="bell-dot"/></button><div className="user-chip"><div className="avatar">林</div><span>林工</span><ChevronDown size={14}/></div></div>
    </header>
    <main className="dashboard">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/>园区安全运行中心 <span className="slash">/</span> 3D 可视化</div><h1>工厂消防数字孪生</h1><p>实时掌握消防设备状态，构建园区安全运行全景视图</p></div><div className="heading-right"><span className="live-pill"><i/> LIVE&nbsp; 实时数据</span><button className="date-button"><Clock3 size={15}/> 2025年06月18日 星期三 <ChevronDown size={14}/></button></div></section>
      <section className="stats-grid">
        <StatCard icon={<ShieldCheck size={19}/>} label="消防设备总数" value={`${counts.total} 台`} note="覆盖园区 3 个区域" tone="blue" />
        <StatCard icon={<AlertTriangle size={19}/>} label="故障告警" value={`${counts.fault} 条`} note="较昨日 +1 条" tone="red" />
        <StatCard icon={<Clock3 size={19}/>} label="待巡检设备" value={`${counts.inspect + 12} 台`} note="今日计划巡检 18 台" tone="amber" />
        <StatCard icon={<Activity size={19}/>} label="设备在线率" value="98.6%" note="较上周 +2.4%" tone="green" />
      </section>
      <section className="content-grid">
        <div className="scene-panel panel">
          <div className="panel-heading scene-heading"><div><div className="section-title"><Layers3 size={17}/><h2>园区三维实景</h2><span className="floor-tag">A栋 · 一层</span></div><div className="panel-subtitle"><span className="tiny-live"/> 模型已同步 <span className="sub-divider">·</span> 最近更新 10:24:36</div></div><div className="scene-tools"><button title="定位选中设备" onClick={() => toast(`已定位到 ${selectedId}`)}><Crosshair size={16}/></button><button title="全屏" onClick={() => toast('全屏模式原型演示')}><Maximize2 size={16}/></button><button title="更多"><MoreHorizontal size={17}/></button></div></div>
          <div className="scene-wrap"><TwinScene devices={devices} selected={selectedId} setSelected={setSelectedId}/><div className="scene-badge"><span className="badge-icon"><MapPin size={14}/></span><div><strong>智造产业园</strong><small>总占地面积 24,800 m²</small></div><ChevronRight size={15}/></div><div className="scene-tools-float"><button onClick={() => toast('已切换至 2D 平面视图')}>2D</button><button className="selected">3D</button></div><div className="scene-legend"><span><i className="legend-dot green"/>正常</span><span><i className="legend-dot red"/>故障</span><span><i className="legend-dot amber"/>待处理</span></div><div className="scene-hint">拖动旋转 · 滚轮缩放 · 点击设备查看详情</div></div>
          <div className="scene-footer"><div className="zone-selector"><span>当前区域</span><button>A栋一层 <ChevronDown size={14}/></button><button>B栋一层 <ChevronDown size={14}/></button><button>厂区总览 <ChevronDown size={14}/></button></div><div className="model-state"><span className="model-icon"><Radio size={14}/></span> BIM 模型 <strong>已加载</strong><span className="model-sep"/> <Wifi size={14}/> 设备点位 <strong>7</strong></div></div>
        </div>
        <aside className="side-column">
          <div className="panel alert-panel"><div className="panel-heading"><div className="section-title"><Siren size={17}/><h2>实时告警</h2><span className="alert-count">2</span></div><button className="text-button" onClick={() => setActiveNav('告警中心')}>查看全部 <ChevronRight size={14}/></button></div>
            <div className="alert-list"><button className="alert-item" onClick={() => setSelectedId('S-014')}><div className="alert-symbol"><AlertTriangle size={16}/></div><div className="alert-copy"><strong>烟感设备离线</strong><span>A栋二层 · 仓储区 · S-014</span><small>10:16:42 <b>·</b> 离线时长 8 分钟</small></div><ChevronRight size={15}/></button><button className="alert-item amber-alert" onClick={() => setSelectedId('P-022')}><div className="alert-symbol"><Clock3 size={16}/></div><div className="alert-copy"><strong>设备待巡检</strong><span>A栋一层 · 包装区 · P-022</span><small>09:42:18 <b>·</b> 已超期 1 天</small></div><ChevronRight size={15}/></button></div>
          </div>
          <div className="panel device-panel"><div className="panel-heading device-heading"><div className="section-title"><Gauge size={17}/><h2>设备监测</h2><span className="device-total">{filteredDevices.length} 台设备</span></div><button className="text-button" onClick={() => setActiveNav('设备管理')}>设备台账 <ChevronRight size={14}/></button></div><div className="device-controls"><label className="search-box"><Search size={15}/><input aria-label="搜索设备" placeholder="搜索设备名称 / 编号" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="清除搜索"><X size={13}/></button>}</label><div className="filter-wrap"><button className={`filter-button ${filter !== '全部' ? 'filter-on' : ''}`} onClick={() => setShowFilter(!showFilter)}>筛选 <ArrowDown size={13}/></button>{showFilter && <div className="filter-menu">{statusOptions.map(option => <button key={option} className={filter === option ? 'chosen' : ''} onClick={() => {setFilter(option); setShowFilter(false);}}>{option}{filter === option && <Check size={13}/>}</button>)}</div>}</div></div>
            <div className="device-list">{filteredDevices.map(device => <button key={device.id} className={`device-row ${selectedId === device.id ? 'device-selected' : ''}`} onClick={() => setSelectedId(device.id)}><div className={`device-type-icon ${statusClass[device.status]}`}>{device.type === '灭火器' ? <Flame size={16}/> : device.type === '烟感' ? <Radio size={16}/> : device.type === '喷淋' ? <Activity size={16}/> : device.type === '报警主机' ? <Bell size={16}/> : <Siren size={16}/>}</div><div className="device-info"><div className="device-name">{device.name}<span>{device.id}</span></div><div className="device-location">{device.location}</div></div><div className="device-state"><span className={`status-label ${statusClass[device.status]}`}><i/>{device.status}</span><small>{device.lastCheck}</small></div></button>)}{filteredDevices.length === 0 && <div className="empty-state">未找到匹配的设备</div>}</div><button className="load-more" onClick={() => toast('已显示全部模拟设备')}>查看全部设备 <ChevronDown size={14}/></button>
          </div>
          <div className="quick-health"><div className="health-icon"><Wifi size={16}/></div><div><strong>通信状态良好</strong><span>网关在线 12 / 12</span></div><div className="health-bars"><i/><i/><i/><i/><i/></div><CircleHelp size={15} className="help-icon"/></div>
        </aside>
      </section>
      <section className="bottom-grid"><div className="panel bottom-panel"><div className="panel-heading"><div className="section-title"><Activity size={16}/><h2>设备状态概览</h2></div><button className="period-button" onClick={() => toast('当前展示近 7 天趋势')}>近 7 天 <ChevronDown size={13}/></button></div><div className="overview-content"><div className="donut" style={{'--progress': '84%'} as React.CSSProperties}><div><strong>98.6<span>%</span></strong><small>设备健康率</small></div></div><div className="health-legend"><div><i className="legend-dot green"/><span>运行正常</span><strong>{counts.total - counts.fault - counts.inspect - counts.due}</strong></div><div><i className="legend-dot red"/><span>故障告警</span><strong>{counts.fault}</strong></div><div><i className="legend-dot amber"/><span>待巡检</span><strong>{counts.inspect}</strong></div><div><i className="legend-dot yellow"/><span>即将到期</span><strong>{counts.due}</strong></div></div><div className="mini-chart"><div className="chart-lines"><i/><i/><i/></div><svg viewBox="0 0 220 70" preserveAspectRatio="none" aria-label="近七日告警趋势"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#35cbb0" stopOpacity=".24"/><stop offset="100%" stopColor="#35cbb0" stopOpacity="0"/></linearGradient></defs><path d="M0 50 C18 43 20 53 38 38 S58 51 77 30 S96 38 113 31 S130 42 148 24 S169 30 183 16 S204 24 220 8 L220 70 L0 70Z" fill="url(#fill)"/><path d="M0 50 C18 43 20 53 38 38 S58 51 77 30 S96 38 113 31 S130 42 148 24 S169 30 183 16 S204 24 220 8" fill="none" stroke="#35cbb0" strokeWidth="2"/></svg><div className="chart-labels"><span>06.12</span><span>06.14</span><span>06.16</span><span>06.18</span></div></div></div></div>
        <div className="panel bottom-panel activity-panel"><div className="panel-heading"><div className="section-title"><Clock3 size={16}/><h2>最近动态</h2></div><button className="text-button" onClick={() => setActiveNav('巡检管理')}>更多记录 <ChevronRight size={14}/></button></div><div className="activity-list"><div className="activity-row"><span className="activity-point green-point"/><div><strong>完成消防设备例行巡检</strong><span>巡检人：王师傅 · A栋一层</span></div><time>10:08</time></div><div className="activity-row"><span className="activity-point red-point"/><div><strong>发现烟感设备离线告警</strong><span>设备编号：S-014 · 仓储���</span></div><time>10:16</time></div><div className="activity-row"><span className="activity-point blue-point"/><div><strong>灭火器 F-001 巡检完成</strong><span>巡检结果：压力正常 · 外观完好</span></div><time>09:12</time></div></div></div>
      </section>
      <footer className="footer"><span>© 2025 安消云 · 工厂消防数字孪生平台 <span className="footer-sep">|</span> 演示原型 · 数据为模拟数据</span><span>数据更新于 10:24:36 <span className="footer-live"/></span></footer>
    </main>
    {showDetail && selectedDevice && <div className="detail-drawer"><button className="drawer-close" onClick={() => setShowDetail(false)} aria-label="关闭设备详情"><X size={17}/></button><div className="drawer-kicker">设备详情 <span>·</span> {selectedDevice.id}</div><h3>{selectedDevice.name}</h3><span className={`status-label ${statusClass[selectedDevice.status]}`}><i/>{selectedDevice.status}</span><div className="drawer-divider"/><dl><dt>设备类型</dt><dd>{selectedDevice.type}</dd><dt>安装位置</dt><dd>{selectedDevice.location}</dd><dt>通信状态</dt><dd><span className={selectedDevice.battery === '离线' ? 'offline' : 'online'}><i/>{selectedDevice.battery}</span></dd><dt>最近巡检</dt><dd>{selectedDevice.lastCheck}</dd></dl>{selectedDevice.status === '故障' ? <button className="primary-action" onClick={acknowledge}><Check size={15}/> 创建处置工单</button> : <button className="secondary-action" onClick={() => toast(`已打开 ${selectedDevice.id} 巡检记录`)}>查看巡检记录 <ChevronRight size={14}/></button>}</div>}
    {!showDetail && <button className="open-detail" onClick={() => setShowDetail(true)}><Download size={15}/>设备详情</button>}
    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}
