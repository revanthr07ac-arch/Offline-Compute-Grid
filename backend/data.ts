export interface DeviceType {
  id: string;
  name: string;
  type: "Laptop" | "PC" | "Pi" | "Android" | "Mac";
  role: "Master" | "Worker";
  ip: string;
  hostname: string;
  cpu: number;
  ram: number;
  storage: number;
  battery: number | null;
  net: string;
  os: string;
  ping: number | null;
  status: "online" | "busy" | "idle" | "offline";
  task: string | null;
}

export interface Task {
  id: string;
  name: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  progress: number;
  eta: string;
  workers: number;
  size: string;
  by: string;
  status: "running" | "pending" | "completed" | "failed" | "cancelled";
  error?: string;
}

export const devices: DeviceType[] = [
  { id: "1", name: "DESKTOP-A7X", type: "Laptop", role: "Master", ip: "192.168.1.101", hostname: "desktop-a7x", cpu: 78, ram: 65, storage: 42, battery: 91, net: "1.2 Gbps", os: "Ubuntu 22.04", ping: 0, status: "online", task: "Coordinating" },
  { id: "2", name: "PC-Tower-2", type: "PC", role: "Worker", ip: "192.168.1.102", hostname: "workstation-b2", cpu: 45, ram: 52, storage: 78, battery: null, net: "1.0 Gbps", os: "Windows 11", ping: 1, status: "busy", task: "Video Encode" },
  { id: "3", name: "RPi-4B-3", type: "Pi", role: "Worker", ip: "192.168.1.103", hostname: "raspberrypi-3", cpu: 89, ram: 71, storage: 23, battery: null, net: "100 Mbps", os: "Raspberry Pi OS", ping: 2, status: "busy", task: "OCR Batch" },
  { id: "4", name: "Samsung-A54", type: "Android", role: "Worker", ip: "192.168.1.104", hostname: "android-samsung", cpu: 34, ram: 48, storage: 56, battery: 67, net: "300 Mbps", os: "Android 14", ping: 8, status: "idle", task: null },
  { id: "5", name: "MacBook-Pro-5", type: "Mac", role: "Worker", ip: "192.168.1.105", hostname: "MBP-M3-5", cpu: 23, ram: 38, storage: 31, battery: 84, net: "1.2 Gbps", os: "macOS 14", ping: 1, status: "online", task: null },
  { id: "6", name: "RPi-Zero-6", type: "Pi", role: "Worker", ip: "192.168.1.106", hostname: "raspberrypi-6", cpu: 12, ram: 29, storage: 18, battery: null, net: "100 Mbps", os: "Raspberry Pi OS", ping: 3, status: "idle", task: null },
  { id: "7", name: "Gaming-PC-7", type: "PC", role: "Worker", ip: "192.168.1.107", hostname: "GAMING-RIG-7", cpu: 0, ram: 0, storage: 88, battery: null, net: "—", os: "Windows 11", ping: null, status: "offline", task: null },
  { id: "8", name: "Lenovo-Tab", type: "Android", role: "Worker", ip: "192.168.1.108", hostname: "lenovo-tab", cpu: 56, ram: 44, storage: 62, battery: 33, net: "150 Mbps", os: "Android 13", ping: 12, status: "online", task: null },
];

export const tasks: Task[] = [
  { id: "t1", name: "4K Video Transcoding — Episode 12", type: "Video", priority: "high", progress: 67, eta: "41 min", workers: 5, size: "8.4 GB", by: "admin", status: "running" },
  { id: "t2", name: "ML Model Training — ResNet50", type: "Python", priority: "critical", progress: 34, eta: "2h 15m", workers: 3, size: "2.1 GB", by: "ai_team", status: "running" },
  { id: "t3", name: "OCR Batch Processing — Archives", type: "Text", priority: "medium", progress: 0, eta: "—", workers: 0, size: "12.4 GB", by: "library_sys", status: "pending" },
  { id: "t4", name: "Nightly Database Backup", type: "System", priority: "low", progress: 100, eta: "—", workers: 1, size: "45.2 GB", by: "system", status: "completed" },
  { id: "t5", name: "Data Scraping — Retailers", type: "Python", priority: "medium", progress: 12, eta: "Failed", workers: 2, size: "450 MB", by: "admin", status: "failed", error: "Connection timeout on proxy pool" },
];
