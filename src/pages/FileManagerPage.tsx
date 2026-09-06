import { useState } from "react";
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
  Image,
  MoreHorizontal,
  Download,
  Trash2,
} from "lucide-react";

interface FileItem {
  id: number;
  name: string;
  size: string;
  type: "video" | "archive" | "document" | "python" | "image";
  date: string;
}

const FILES: FileItem[] = [
  { id: 1, name: "video_batch_ep12.mp4", size: "4.2 GB", type: "video", date: "Jun 12" },
  { id: 2, name: "ml_dataset.zip", size: "2.1 GB", type: "archive", date: "Jun 11" },
  { id: 3, name: "product_photos.zip", size: "1.2 GB", type: "archive", date: "Jun 10" },
  { id: 4, name: "q4_reports.pdf", size: "450 MB", type: "document", date: "Jun 9" },
  { id: 5, name: "pipeline_v2.py", size: "18 MB", type: "python", date: "Jun 8" },
  { id: 6, name: "podcast_s3.zip", size: "340 MB", type: "archive", date: "Jun 7" },
  { id: 7, name: "thumbnail_gen.py", size: "4 MB", type: "python", date: "Jun 6" },
  { id: 8, name: "invoice_scans.zip", size: "890 MB", type: "archive", date: "Jun 5" },
];

const FOLDERS = [
  { id: "uploads", label: "Uploads", count: 34 },
  { id: "processed", label: "Processed", count: 128 },
  { id: "downloads", label: "Downloads", count: 12 },
  { id: "shared", label: "Shared", count: 7 },
  { id: "trash", label: "Trash", count: 3 },
];

function getFileIconConfig(type: FileItem["type"]) {
  switch (type) {
    case "video":
      return { bg: "#F3F0FF", icon: <Film size={32} color="#7C5CFC" /> };
    case "archive":
      return { bg: "#FFF7ED", icon: <Archive size={32} color="#F59E0B" /> };
    case "document":
      return { bg: "#ECFDF5", icon: <FileText size={32} color="#10B981" /> };
    case "python":
      return { bg: "#EEF3FF", icon: <Code2 size={32} color="#4F6FFF" /> };
    case "image":
      return { bg: "#EEF3FF", icon: <Image size={32} color="#4F6FFF" /> };
  }
}

function getSmallIcon(type: FileItem["type"]) {
  switch (type) {
    case "video":
      return <Film size={24} color="#7C5CFC" />;
    case "archive":
      return <Archive size={24} color="#F59E0B" />;
    case "document":
      return <FileText size={24} color="#10B981" />;
    case "python":
      return <Code2 size={24} color="#4F6FFF" />;
    case "image":
      return <Image size={24} color="#4F6FFF" />;
  }
}

interface Props {
  onFileSelect?: (file: any) => void;
}

export default function FileManagerPage({ onFileSelect }: Props) {
  const [activeFolder, setActiveFolder] = useState("uploads");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = FILES.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh" }}>
      {/* Search bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={16}
            color="#98A2B3"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            style={{
              width: "100%",
              height: 40,
              background: "#F1F4F9",
              border: "none",
              borderRadius: 10,
              paddingLeft: 34,
              paddingRight: 12,
              fontSize: 14,
              color: "#111827",
              outline: "none",
            }}
          />
        </div>
        <button
          style={{
            width: 36,
            height: 36,
            border: "1px solid #E6EAF0",
            borderRadius: 10,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Upload size={16} color="#667085" />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          style={{
            width: 36,
            height: 36,
            border: "none",
            borderRadius: 10,
            background: viewMode === "grid" ? "#EEF3FF" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <LayoutGrid size={16} color={viewMode === "grid" ? "#4F6FFF" : "#667085"} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          style={{
            width: 36,
            height: 36,
            border: "none",
            borderRadius: 10,
            background: viewMode === "list" ? "#EEF3FF" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <List size={16} color={viewMode === "list" ? "#4F6FFF" : "#667085"} />
        </button>
      </div>

      {/* Storage widget */}
      <div className="card" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#EEF3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HardDrive size={20} color="#4F6FFF" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              247 GB used of 512 GB
            </div>
            <div
              style={{
                height: 8,
                background: "#F1F4F9",
                borderRadius: 2,
                margin: "6px 0 4px",
                overflow: "hidden",
              }}
            >
              <div
                className="progress-bar-fill"
                style={{
                  width: "48%",
                  height: "100%",
                  background: "linear-gradient(90deg, #4F6FFF, #7C5CFC)",
                  borderRadius: 2,
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: "#98A2B3" }}>48% · 265 GB free</div>
          </div>
        </div>
      </div>

      {/* Folder tabs */}
      <div
        style={{
          padding: "12px 16px 0",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 20,
              border: "none",
              background: activeFolder === f.id ? "#4F6FFF" : "#F1F4F9",
              color: activeFolder === f.id ? "#FFFFFF" : "#667085",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {f.label}
            <span
              style={{
                background: activeFolder === f.id ? "rgba(255,255,255,0.25)" : "#E6EAF0",
                color: activeFolder === f.id ? "#FFFFFF" : "#667085",
                borderRadius: 10,
                padding: "0 6px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* File grid / list */}
      <div style={{ padding: "12px 16px 96px" }}>
        {viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {filtered.map((file) => {
              const { bg, icon } = getFileIconConfig(file.type);
              return (
                <div
                  key={file.id}
                  className="card-sm animate-fade-in-up"
                  style={{ padding: 12, cursor: "pointer", position: "relative" }}
                  onClick={() => onFileSelect?.(file)}
                >
                  <button
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={14} color="#98A2B3" />
                  </button>
                  <div
                    style={{
                      width: "100%",
                      height: 80,
                      borderRadius: 10,
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#111827",
                      marginTop: 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2 }}>
                    {file.size}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            {filtered.map((file, i) => (
              <div
                key={file.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < filtered.length - 1 ? "1px solid #E6EAF0" : "none",
                  cursor: "pointer",
                }}
                onClick={() => onFileSelect?.(file)}
              >
                {getSmallIcon(file.type)}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2 }}>
                    {file.size} · {file.date}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={16} color="#667085" />
                  </button>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
