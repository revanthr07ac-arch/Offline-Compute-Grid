import { useState, useRef } from "react";
import {
  Search,
  Upload,
  LayoutGrid,
  List,
  HardDrive,
  Film,
  Archive,
  FileText,
  Code2,
  Image as ImageIcon,
  MoreHorizontal,
  Download,
  Trash2,
  X,
  Share2,
  Edit2,
  Check,
  Server,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { useToast } from "../components/Toast";

export interface FileItem {
  id: number;
  name: string;
  size: string;
  bytes: number;
  type: "video" | "archive" | "document" | "python" | "image";
  category: "uploads" | "processed" | "downloads" | "shared" | "trash";
  date: string;
  hash?: string;
  chunks?: { node: string; chunkId: string; status: "synced" | "caching" }[];
}

const INITIAL_FILES: FileItem[] = [
  {
    id: 1,
    name: "video_batch_ep12.mp4",
    size: "4.2 GB",
    bytes: 4509715660,
    type: "video",
    category: "downloads",
    date: "Jun 12",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-001", status: "synced" },
      { node: "Mac-Studio", chunkId: "chk-002", status: "synced" },
      { node: "Worker-Rig-RTX", chunkId: "chk-003", status: "synced" }
    ]
  },
  {
    id: 2,
    name: "ml_dataset.zip",
    size: "2.1 GB",
    bytes: 2254857830,
    type: "archive",
    category: "downloads",
    date: "Jun 11",
    hash: "7d793037a0760186574b0282f2f435e70d71d4b7bed25d47ac6cb577e33f2804",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-004", status: "synced" },
      { node: "NAS-Storage", chunkId: "chk-005", status: "synced" }
    ]
  },
  {
    id: 3,
    name: "product_photos.zip",
    size: "1.2 GB",
    bytes: 1288490188,
    type: "archive",
    category: "uploads",
    date: "Jun 10",
    hash: "b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-006", status: "synced" }
    ]
  },
  {
    id: 4,
    name: "q4_reports.pdf",
    size: "450 MB",
    bytes: 471859200,
    type: "document",
    category: "processed",
    date: "Jun 9",
    hash: "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d8ac35b6e471e9cbece0",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-007", status: "synced" },
      { node: "Laptop-Dev", chunkId: "chk-008", status: "synced" }
    ]
  },
  {
    id: 5,
    name: "pipeline_v2.py",
    size: "18 MB",
    bytes: 18874368,
    type: "python",
    category: "uploads",
    date: "Jun 8",
    hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-009", status: "synced" }
    ]
  },
  {
    id: 6,
    name: "podcast_s3.zip",
    size: "340 MB",
    bytes: 356515840,
    type: "archive",
    category: "shared",
    date: "Jun 7",
    hash: "c20ad4d76fe97759aa27a0c99bff6710ea4733607b51b2e2d93eef25cc1ff12e",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-010", status: "synced" },
      { node: "Mac-Studio", chunkId: "chk-011", status: "synced" }
    ]
  },
  {
    id: 7,
    name: "thumbnail_gen.py",
    size: "4 MB",
    bytes: 4194304,
    type: "python",
    category: "processed",
    date: "Jun 6",
    hash: "d9e87900b998cf9beab7eb8a2e0a2958742b6a78ca6e46e8c89b88f825e34771",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-012", status: "synced" }
    ]
  },
  {
    id: 8,
    name: "invoice_scans.zip",
    size: "890 MB",
    bytes: 933232640,
    type: "archive",
    category: "trash",
    date: "Jun 5",
    hash: "2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef9f5402163b4",
    chunks: [
      { node: "DESKTOP-A7X (Master)", chunkId: "chk-013", status: "caching" }
    ]
  },
];

function getFileIcon(type: FileItem["type"], size = 28) {
  switch (type) {
    case "video":
      return <Film size={size} className="text-[#FF7A00]" />;
    case "archive":
      return <Archive size={size} className="text-[#FFA033]" />;
    case "document":
      return <FileText size={size} className="text-[#10B981]" />;
    case "python":
      return <Code2 size={size} className="text-[#38BDF8]" />;
    case "image":
      return <ImageIcon size={size} className="text-[#EC4899]" />;
  }
}

interface Props {
  onFileSelect?: (file: FileItem) => void;
}

export default function FileManagerPage({ onFileSelect }: Props) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null);
  const [newName, setNewName] = useState("");

  const folderCounts = {
    all: files.filter(f => f.category !== "trash").length,
    uploads: files.filter((f) => f.category === "uploads").length,
    processed: files.filter((f) => f.category === "processed").length,
    downloads: files.filter((f) => f.category === "downloads").length,
    shared: files.filter((f) => f.category === "shared").length,
    trash: files.filter((f) => f.category === "trash").length,
  };

  const folders = [
    { id: "all", label: "All Files", count: folderCounts.all },
    { id: "uploads", label: "Uploads", count: folderCounts.uploads },
    { id: "processed", label: "Processed", count: folderCounts.processed },
    { id: "downloads", label: "Downloads", count: folderCounts.downloads },
    { id: "shared", label: "Shared", count: folderCounts.shared },
    { id: "trash", label: "Trash", count: folderCounts.trash },
  ];

  const filtered = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFolder === "all") {
      return matchesSearch && f.category !== "trash";
    }
    return matchesSearch && f.category === activeFolder;
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const file = uploadedFiles[0];
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 * 1024 
      ? `${(file.size / (1024 * 1024 * 1024)).toFixed(1)} GB`
      : `${sizeMB} MB`;

    let extType: FileItem["type"] = "document";
    if (file.name.match(/\.(mp4|mkv|mov|avi)$/i)) extType = "video";
    else if (file.name.match(/\.(zip|tar|gz|7z|rar)$/i)) extType = "archive";
    else if (file.name.match(/\.(py|js|ts|json|rs)$/i)) extType = "python";
    else if (file.name.match(/\.(png|jpg|jpeg|webp|svg)$/i)) extType = "image";

    const newFileItem: FileItem = {
      id: Date.now(),
      name: file.name,
      size: sizeStr,
      bytes: file.size,
      type: extType,
      category: "uploads",
      date: "Just now",
      hash: "a" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 6),
      chunks: [
        { node: "DESKTOP-A7X (Master)", chunkId: `chk-${Math.floor(Math.random() * 900 + 100)}`, status: "synced" }
      ]
    };

    setFiles((prev) => [newFileItem, ...prev]);
    showToast({
      type: "success",
      message: `Uploaded "${file.name}" to cluster storage.`
    });
    // reset input
    e.target.value = "";
  };

  const handleDownload = (file: FileItem) => {
    const content = `Offline Compute Grid Telemetry & Cluster Asset\nFile: ${file.name}\nSize: ${file.size}\nHash: ${file.hash || "verified"}\nCluster Status: Synchronized across 8 nodes.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      message: `Downloading "${file.name}"...`
    });
  };

  const handleDelete = (file: FileItem) => {
    if (file.category === "trash") {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      showToast({
        type: "info",
        message: `Permanently removed "${file.name}".`
      });
      if (selectedFile?.id === file.id) setSelectedFile(null);
    } else {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, category: "trash" } : f))
      );
      showToast({
        type: "warning",
        message: `Moved "${file.name}" to Trash.`
      });
      if (selectedFile?.id === file.id) setSelectedFile(null);
    }
  };

  const handleRestore = (file: FileItem) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, category: "downloads" } : f))
    );
    showToast({
      type: "success",
      message: `Restored "${file.name}" to Downloads.`
    });
  };

  const handleEmptyTrash = () => {
    const trashCount = files.filter(f => f.category === "trash").length;
    if (trashCount === 0) return;
    setFiles((prev) => prev.filter((f) => f.category !== "trash"));
    showToast({
      type: "info",
      message: `Purged ${trashCount} files from trash.`
    });
  };

  const handleStartRename = (file: FileItem) => {
    setRenamingFile(file);
    setNewName(file.name);
    setActiveMenuId(null);
  };

  const handleSaveRename = () => {
    if (!renamingFile || !newName.trim()) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === renamingFile.id ? { ...f, name: newName.trim() } : f))
    );
    showToast({
      type: "success",
      message: `Renamed to "${newName.trim()}".`
    });
    setRenamingFile(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Search & Filter Bar */}
      <div className="sticky top-0 z-20 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cluster files..."
            className="w-full h-10 bg-[#18191E] border border-[#282A32] rounded-xl pl-10 pr-4 text-sm text-[#FFFFFF] placeholder-[#667085] focus:outline-none focus:border-[#FF7A00] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E929E] hover:text-[#FFFFFF]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={handleUploadClick}
          title="Upload file to cluster"
          className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:brightness-110 active:scale-95 text-[#FFFFFF] text-xs font-semibold flex items-center gap-2 shadow-[0_2px_12px_rgba(255,122,0,0.3)] transition-all flex-shrink-0 cursor-pointer"
        >
          <Upload size={15} />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <div className="flex items-center bg-[#18191E] border border-[#282A32] rounded-xl p-0.5 flex-shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-[#282A32] text-[#FF7A00] shadow"
                : "text-[#8E929E] hover:text-[#FFFFFF]"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-[#282A32] text-[#FF7A00] shadow"
                : "text-[#8E929E] hover:text-[#FFFFFF]"
            }`}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 space-y-4">
        {/* Storage Widget - Styled Exact like 1st Image */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,122,0,0.12)] border border-[rgba(255,122,0,0.25)] flex items-center justify-center flex-shrink-0">
              <HardDrive size={22} className="text-[#FF7A00]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#FFFFFF]">
                  247 GB used of 512 GB
                </span>
                <span className="text-xs text-[#8E929E]">48% • 265 GB free</span>
              </div>
              <div className="h-2 w-full bg-[#1F2128] rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] via-[#FFA033] to-[#FF5500] shadow-[0_0_8px_rgba(255,122,0,0.5)] transition-all duration-500"
                  style={{ width: "48%" }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-[#8E929E]">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                    Videos (142 GB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFA033]" />
                    Datasets (85 GB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                    Code (20 GB)
                  </span>
                </div>
                <button
                  onClick={() => {
                    showToast({
                      type: "info",
                      message: "Cluster cache cleaned. 1.4 GB freed."
                    });
                  }}
                  className="text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  <RefreshCw size={11} /> Clean Cache
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Folder Navigation Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {folders.map((f) => {
              const isActive = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-[#FFFFFF] shadow-[0_2px_10px_rgba(255,122,0,0.35)]"
                      : "bg-[#18191E] text-[#8E929E] border border-[#24262E] hover:border-[#383A46] hover:text-[#FFFFFF]"
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-black/25 text-[#FFFFFF]"
                        : "bg-[#282A32] text-[#8E929E]"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeFolder === "trash" && folderCounts.trash > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all flex-shrink-0 cursor-pointer"
            >
              <Trash2 size={13} />
              Empty Trash
            </button>
          )}
        </div>

        {/* Files View */}
        {filtered.length === 0 ? (
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-12 text-center">
            <FolderOpen size={48} className="mx-auto text-[#8E929E] opacity-40 mb-3" />
            <h3 className="text-base font-semibold text-[#FFFFFF]">No files found</h3>
            <p className="text-xs text-[#8E929E] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No files matching "${searchQuery}"`
                : "This directory is currently empty. Upload files to distribute them across the compute grid."}
            </p>
            <button
              onClick={handleUploadClick}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-md cursor-pointer"
            >
              <Upload size={14} /> Upload File
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filtered.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file);
                  onFileSelect?.(file);
                }}
                className="group relative bg-[#14151B] hover:bg-[#18191E] border border-[#24262E] hover:border-[#FF7A00]/50 rounded-2xl p-3.5 transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(255,122,0,0.15)] flex flex-col justify-between"
              >
                {/* 3-dots action menu */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === file.id ? null : file.id);
                    }}
                    className="p-1 rounded-lg text-[#8E929E] hover:text-[#FFFFFF] hover:bg-[#282A32] transition-colors"
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === file.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-7 w-40 bg-[#1C1D24] border border-[#282A32] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button
                        onClick={() => {
                          setSelectedFile(file);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#E5E7EB] hover:bg-[#282A32] flex items-center gap-2"
                      >
                        <HardDrive size={13} className="text-[#FF7A00]" /> Inspect Chunks
                      </button>
                      <button
                        onClick={() => {
                          handleDownload(file);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#E5E7EB] hover:bg-[#282A32] flex items-center gap-2"
                      >
                        <Download size={13} className="text-[#10B981]" /> Download
                      </button>
                      <button
                        onClick={() => handleStartRename(file)}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#E5E7EB] hover:bg-[#282A32] flex items-center gap-2"
                      >
                        <Edit2 size={13} className="text-[#38BDF8]" /> Rename
                      </button>
                      {file.category === "trash" ? (
                        <button
                          onClick={() => {
                            handleRestore(file);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-emerald-400 hover:bg-[#282A32] flex items-center gap-2"
                        >
                          <RefreshCw size={13} /> Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleDelete(file);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-[#282A32] flex items-center gap-2 border-t border-[#282A32] mt-1 pt-1.5"
                        >
                          <Trash2 size={13} /> Move to Trash
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* File Thumbnail Preview */}
                <div className="w-full h-24 rounded-xl bg-[#0D0E12] border border-[#20222A] flex items-center justify-center relative overflow-hidden group-hover:border-[#FF7A00]/30 transition-colors">
                  <div className="p-3 rounded-2xl bg-[#18191E]/80 backdrop-blur-sm border border-[#282A32]">
                    {getFileIcon(file.type, 30)}
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#18191E]/90 text-[10px] font-medium text-[#8E929E] uppercase tracking-wider">
                    {file.type}
                  </span>
                </div>

                {/* Meta details */}
                <div className="mt-3">
                  <p
                    className="text-xs font-semibold text-[#FFFFFF] truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#8E929E] mt-1">
                    <span>{file.size}</span>
                    <span>{file.date}</span>
                  </div>
                </div>

                {/* Quick actions on card */}
                <div className="mt-3 pt-2.5 border-t border-[#20222A] flex items-center justify-between">
                  <span className="text-[10px] text-[#FF7A00] flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {file.chunks?.length || 1} chunks
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      className="p-1.5 rounded-lg text-[#8E929E] hover:text-[#FF7A00] hover:bg-[#20222A] transition-colors"
                      title="Download file"
                    >
                      <Download size={13} />
                    </button>
                    {file.category === "trash" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(file);
                        }}
                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-[#20222A] transition-colors"
                        title="Restore"
                      >
                        <RefreshCw size={13} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                        className="p-1.5 rounded-lg text-[#8E929E] hover:text-red-400 hover:bg-[#20222A] transition-colors"
                        title="Move to trash"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl overflow-hidden divide-y divide-[#24262E]">
            {filtered.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file);
                  onFileSelect?.(file);
                }}
                className="px-4 py-3 flex items-center gap-3.5 hover:bg-[#18191E] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0D0E12] border border-[#20222A] flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.type, 18)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#FFFFFF] truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-[#8E929E] mt-0.5">
                    {file.size} • {file.date} • {file.chunks?.length || 1} distributed chunk(s)
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="p-2 rounded-xl text-[#8E929E] hover:text-[#FF7A00] hover:bg-[#20222A] transition-colors"
                    title="Download file"
                  >
                    <Download size={15} />
                  </button>
                  {file.category === "trash" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(file);
                      }}
                      className="p-2 rounded-xl text-emerald-400 hover:bg-[#20222A] transition-colors"
                      title="Restore"
                    >
                      <RefreshCw size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file);
                      }}
                      className="p-2 rounded-xl text-[#8E929E] hover:text-red-400 hover:bg-[#20222A] transition-colors"
                      title="Move to trash"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Inspector Modal */}
      {selectedFile && (
        <div
          onClick={() => setSelectedFile(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#14151B] border border-[#282A32] rounded-2xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-150 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#24262E] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#1C1D24] border border-[#282A32]">
                  {getFileIcon(selectedFile.type, 22)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#FFFFFF] truncate max-w-[280px]">
                    {selectedFile.name}
                  </h3>
                  <p className="text-[11px] text-[#8E929E]">{selectedFile.size} • {selectedFile.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded-lg text-[#8E929E] hover:text-[#FFFFFF] hover:bg-[#20222A]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Checksum / Hash */}
            <div className="bg-[#0B0C0E] border border-[#24262E] rounded-xl p-3">
              <span className="text-[10px] font-semibold text-[#8E929E] uppercase tracking-wider block">
                SHA-256 Checksum (Integrity Verified)
              </span>
              <p className="text-xs font-mono text-[#FF7A00] break-all mt-1">
                {selectedFile.hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
              </p>
            </div>

            {/* Chunk Distribution Map */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#FFFFFF] flex items-center gap-1.5">
                  <Server size={14} className="text-[#FF7A00]" />
                  Cluster Node Distribution
                </span>
                <span className="text-[11px] text-[#10B981] font-mono">100% Synced</span>
              </div>
              <div className="space-y-1.5 bg-[#0D0E12] border border-[#20222A] rounded-xl p-3">
                {selectedFile.chunks?.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#1E2028] last:border-none">
                    <span className="text-[#E5E7EB] font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {c.node}
                    </span>
                    <span className="text-[10px] font-mono text-[#8E929E]">
                      {c.chunkId} • {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  handleDelete(selectedFile);
                }}
                className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all"
              >
                {selectedFile.category === "trash" ? "Delete Forever" : "Move to Trash"}
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedFile);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-md hover:brightness-110 flex items-center gap-1.5"
              >
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename File Modal */}
      {renamingFile && (
        <div
          onClick={() => setRenamingFile(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#14151B] border border-[#282A32] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-[#FFFFFF]">Rename File</h3>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full h-10 bg-[#18191E] border border-[#282A32] rounded-xl px-3 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF7A00]"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRenamingFile(null)}
                className="px-3 py-1.5 rounded-xl border border-[#282A32] text-xs text-[#8E929E] hover:text-[#FFFFFF]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
