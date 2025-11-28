import React, { useMemo, useRef } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    Activity,
    History,
    PanelsTopLeft,
    Download,
    Upload,
    Mail,
    Trash2,
    HardDrive,
    Smartphone,
    Tablet,
    Monitor,
    BarChart3,
    Clock3,
} from "lucide-react";

const MAX_WIDTH = "max-w-[420px]";

type ViewMode = "auto" | "mobile" | "tablet" | "desktop";

export type HistoryEntry = {
    id: string;
    tileId?: string;
    tileLabel: string;
    pageIndex: number;
    timestamp: number;
    pressDurationMs?: number;
    releasedAt?: number;
};

export type TileUsageStat = {
    tileId?: string;
    label: string;
    count: number;
    lastUsed: number;
    avgDurationMs?: number;
};

interface EditorDashboardProps {
    onExit: () => void;
    onOpenBoard?: () => void;
    showFooterAction?: boolean;
    history: HistoryEntry[];
    historySizeBytes: number;
    historyLimitMb: number;
    onChangeHistoryLimit: (value: number) => void;
    onClearHistory: () => void;
    onExportHistory: () => void;
    onImportHistory: (file: File) => void;
    onEmailHistory: () => void;
    onExportAll: () => void;
    onImportAll: (file: File) => void;
    firstName: string;
    lastName: string;
    onMetaChange: (field: "firstName" | "lastName", value: string) => void;
    viewMode: ViewMode;
    onChangeViewMode: (mode: ViewMode) => void;
    tileUsageStats?: TileUsageStat[];
}

const Card: React.FC<{
    title: string;
    icon?: React.ReactNode;
    subtitle?: string;
    children: React.ReactNode;
}> = ({ title, icon, subtitle, children }) => (
    <section className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] px-4 py-5 text-slate-100">
        <div className="flex items-start gap-3">
            <div className="mt-1 text-cyan-400">{icon}</div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">
                        {title}
                    </h3>
                </div>
                {subtitle && (
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
        <div className="mt-4">{children}</div>
    </section>
);

const ViewModeButton: React.FC<{
    label: string;
    mode: ViewMode;
    current: ViewMode;
    icon: React.ReactNode;
    onSelect: (mode: ViewMode) => void;
}> = ({ label, mode, current, icon, onSelect }) => {
    const active = current === mode;
    return (
        <button
            onClick={() => onSelect(mode)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-sm font-semibold transition ${
                active
                    ? "border-cyan-400 text-cyan-100 bg-cyan-400/10 shadow-lg"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
        >
            {icon}
            {label}
        </button>
    );
};

const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${bytes} o`;
};

const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
};

const formatDuration = (ms?: number) => {
    if (ms === undefined) return "n/a";
    if (ms < 1000) return `${Math.max(0, ms).toFixed(0)} ms`;
    return `${(ms / 1000).toFixed(1)} s`;
};

const EditorDashboard: React.FC<EditorDashboardProps> = ({
    onExit,
    onOpenBoard,
    showFooterAction = true,
    history,
    historySizeBytes,
    historyLimitMb,
    onChangeHistoryLimit,
    onClearHistory,
    onExportHistory,
    onImportHistory,
    onEmailHistory,
    onExportAll,
    onImportAll,
    firstName,
    lastName,
    onMetaChange,
    viewMode,
    onChangeViewMode,
    tileUsageStats = [],
}) => {
    const importHistoryRef = useRef<HTMLInputElement | null>(null);
    const importAllRef = useRef<HTMLInputElement | null>(null);

    const recentHistory = useMemo(() => {
        const slice = history.slice(-5);
        return slice.reverse();
    }, [history]);

    const topTiles = useMemo(
        () => (tileUsageStats || []).slice(0, 5),
        [tileUsageStats]
    );

    const totalPresses = useMemo(
        () => (tileUsageStats || []).reduce((sum, stat) => sum + stat.count, 0),
        [tileUsageStats]
    );

    const averagePressDuration = useMemo(() => {
        const entriesWithDuration = (tileUsageStats || []).filter(
            (stat) => stat.avgDurationMs !== undefined
        );
        if (entriesWithDuration.length === 0) return undefined;
        const totalDuration = entriesWithDuration.reduce(
            (sum, stat) => sum + (stat.avgDurationMs || 0),
            0
        );
        return totalDuration / entriesWithDuration.length;
    }, [tileUsageStats]);

    const paddingBottom = showFooterAction ? "pb-28" : "pb-16";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#050810] via-[#0a0f1a] to-[#101520] text-white">
            <div
                className={`mx-auto w-full ${MAX_WIDTH} px-4 ${paddingBottom} pt-4 space-y-4`}
            >
                {/* Top bar */}
                <header className="sticky top-0 z-20">
                    <div className="rounded-2xl bg-gradient-to-r from-slate-900/80 to-slate-800/60 border border-slate-700 px-3 py-3 flex items-center justify-between shadow-lg backdrop-blur">
                        <button
                            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 transition"
                            onClick={onExit}
                            aria-label="Quitter le mode modifieur"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div className="text-center leading-tight">
                            <div className="text-base font-semibold">
                                Tableau de bord
                            </div>
                            <div className="text-xs text-slate-400">
                                Mode modifieur
                            </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-800/80 text-cyan-400">
                            <ShieldCheck size={22} />
                        </div>
                    </div>
                </header>

                {/* Profil & affichage */}
                <Card
                    title="Profil & affichage"
                    icon={<Activity size={18} />}
                    subtitle="Renseignez le nom/prénom pour les exports, et choisissez le mode d’affichage forcé."
                >
                    <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm text-slate-300 font-semibold">
                                Prénom
                            </label>
                            <input
                                value={firstName}
                                onChange={(e) =>
                                    onMetaChange("firstName", e.target.value)
                                }
                                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                                placeholder="Prénom"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm text-slate-300 font-semibold">
                                Nom
                            </label>
                            <input
                                value={lastName}
                                onChange={(e) =>
                                    onMetaChange("lastName", e.target.value)
                                }
                                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                                placeholder="Nom"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm text-slate-300 font-semibold">
                                Mode d’affichage
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <ViewModeButton
                                    label="Auto"
                                    mode="auto"
                                    current={viewMode}
                                    icon={<Monitor size={16} />}
                                    onSelect={onChangeViewMode}
                                />
                                <ViewModeButton
                                    label="Mobile"
                                    mode="mobile"
                                    current={viewMode}
                                    icon={<Smartphone size={16} />}
                                    onSelect={onChangeViewMode}
                                />
                                <ViewModeButton
                                    label="Tablette"
                                    mode="tablet"
                                    current={viewMode}
                                    icon={<Tablet size={16} />}
                                    onSelect={onChangeViewMode}
                                />
                                <ViewModeButton
                                    label="Desktop"
                                    mode="desktop"
                                    current={viewMode}
                                    icon={<Monitor size={16} />}
                                    onSelect={onChangeViewMode}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Historique */}
                <Card
                    title="Historique & stockage"
                    icon={<History size={18} />}
                    subtitle="Enregistre les touches utilisées. Tout est stocké en local, exportable/importable."
                >
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>
                                {history.length} entrées ·{" "}
                                {formatBytes(historySizeBytes)}
                            </span>
                            <span className="text-slate-500">
                                Limite: {historyLimitMb} Mo
                            </span>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min={50}
                                max={200}
                                step={10}
                                value={historyLimitMb}
                                onChange={(e) =>
                                    onChangeHistoryLimit(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full accent-cyan-400"
                            />
                            <p className="text-xs text-slate-400">
                                Ajustez le plafond (50 à 200 Mo). Au-delà,
                                l’application demandera avant de continuer.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={onExportHistory}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold hover:bg-slate-700"
                            >
                                <Download size={16} />
                                Exporter
                            </button>
                            <button
                                onClick={() => importHistoryRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold hover:bg-slate-700"
                            >
                                <Upload size={16} />
                                Importer
                            </button>
                            <button
                                onClick={onEmailHistory}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold hover:bg-slate-700"
                            >
                                <Mail size={16} />
                                Email
                            </button>
                            <button
                                onClick={onClearHistory}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/80 border border-red-500 text-sm font-semibold hover:bg-red-600"
                            >
                                <Trash2 size={16} />
                                Effacer
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs uppercase text-slate-500 font-semibold tracking-wide">
                                Dernières actions
                            </div>
                            <div className="space-y-2">
                                {recentHistory.length === 0 && (
                                    <div className="text-sm text-slate-500">
                                        Aucune donnée pour l’instant.
                                    </div>
                                )}
                                {recentHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2 text-sm text-slate-200"
                                    >
                                        <span className="font-semibold">
                                            {item.tileLabel}
                                        </span>
                                        <span className="text-slate-400 text-xs">
                                            Page {item.pageIndex + 1}
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Statistiques */}
                <Card
                    title="Statistiques d'usage"
                    icon={<BarChart3 size={18} />}
                    subtitle="Bas�� sur l'historique local des pressions."
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2">
                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                    Touches totales
                                </div>
                                <div className="text-xl font-semibold text-white">
                                    {totalPresses}
                                </div>
                            </div>
                            <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2">
                                <div className="text-xs text-slate-400 uppercase tracking-wide">
                                    Tuiles distinctes
                                </div>
                                <div className="text-xl font-semibold text-white">
                                    {tileUsageStats.length}
                                </div>
                            </div>
                            <div className="rounded-xl bg-slate-800/70 border border-slate-700 px-3 py-2">
                                <div className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                    <Clock3 size={14} /> Dur��e moyenne
                                </div>
                                <div className="text-xl font-semibold text-white">
                                    {formatDuration(averagePressDuration)}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-xs uppercase text-slate-500 font-semibold tracking-wide">
                                Tuiles les plus utilis��es
                            </div>
                            {topTiles.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Pas encore de donn��es.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topTiles.map((tile, idx) => {
                                        const maxCount = topTiles[0]?.count || 1;
                                        const ratio = Math.min(
                                            100,
                                            Math.round(
                                                (tile.count / maxCount) * 100
                                            )
                                        );
                                        return (
                                            <div
                                                key={`${tile.tileId || tile.label}-${idx}`}
                                                className="space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-sm text-slate-200">
                                                    <span className="font-semibold">
                                                        {tile.label}
                                                    </span>
                                                    <span className="text-slate-400 text-xs">
                                                        {tile.count} utilisations
                                                    </span>
                                                </div>
                                                <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 transition-all"
                                                        style={{ width: `${ratio}%` }}
                                                    />
                                                </div>
                                                {tile.avgDurationMs !== undefined && (
                                                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <Clock3 size={12} />
                                                        Dur��e moy. {formatDuration(tile.avgDurationMs)}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Export global */}
                <Card
                    title="Export / import global"
                    icon={<Download size={18} />}
                    subtitle="Exportez ou importez toutes les données (tuiles, historique, préférences, métadonnées)."
                >
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={onExportAll}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-semibold active:scale-98 transition"
                        >
                            <Download size={16} />
                            Exporter tout
                        </button>
                        <button
                            onClick={() => importAllRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-semibold hover:bg-slate-700 active:scale-98 transition"
                        >
                            <Upload size={16} />
                            Importer tout
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        Le fichier JSON inclut : tuiles, historique, compteur
                        d’ID, mode d’affichage, nom/prénom, date d’export.
                    </p>
                </Card>

                {/* Tuiles */}
                <Card
                    title="Tuiles & mise en page"
                    icon={<PanelsTopLeft size={18} />}
                    subtitle="Accès rapide à la gestion des tuiles."
                >
                    <div className="grid grid-cols-1 gap-2">
                        <button
                            className="w-full rounded-2xl bg-slate-800 text-slate-100 font-semibold py-3 px-4 border border-slate-700 active:scale-97 transition"
                            onClick={onOpenBoard}
                        >
                            Gérer les tuiles
                        </button>
                        <button
                            className="w-full rounded-2xl bg-slate-800 text-slate-100 font-semibold py-3 px-4 border border-slate-700 active:scale-97 transition"
                            onClick={onOpenBoard}
                        >
                            Prévisualiser l’UI
                        </button>
                    </div>
                </Card>

                {/* Sécurité */}
                <Card
                    title="Sécurité & stockage local"
                    icon={<HardDrive size={18} />}
                    subtitle="Le code PIN reste fixe. Les données restent en local tant que vous n’exportez pas."
                >
                    <ul className="space-y-2 text-sm text-slate-200">
                        <li className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-3">
                            <span>Code PIN</span>
                            <span className="text-slate-400 text-xs">
                                Non modifiable ici
                            </span>
                        </li>
                        <li className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-3">
                            <span>Export ciblé</span>
                            <span className="text-slate-400 text-xs">
                                Historique ou global
                            </span>
                        </li>
                        <li className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-3">
                            <span>Import</span>
                            <span className="text-slate-400 text-xs">
                                Remplace les données locales
                            </span>
                        </li>
                    </ul>
                </Card>
            </div>

            {/* Hidden file inputs */}
            <input
                ref={importHistoryRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImportHistory(file);
                    e.target.value = "";
                }}
            />
            <input
                ref={importAllRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImportAll(file);
                    e.target.value = "";
                }}
            />

            {/* Footer pill */}
            {showFooterAction && (
                <footer className="fixed inset-x-0 bottom-0 pb-3 flex justify-center">
                    <div className={`w-[92%] ${MAX_WIDTH} px-2`}>
                        <div className="mx-auto flex items-center justify-center">
                            <button className="flex items-center gap-3 rounded-full px-4 py-3 w-full justify-center text-slate-900 font-semibold shadow-[0_20px_50px_-25px_rgba(0,255,255,0.6)] bg-gradient-to-r from-cyan-500 to-teal-500 active:scale-98 transition relative overflow-hidden">
                                <span className="h-10 w-10 rounded-full bg-slate-900/20 flex items-center justify-center text-slate-900">
                                    <ShieldCheck size={22} />
                                </span>
                                <span className="text-base tracking-tight">
                                    Modifier
                                </span>
                                <div className="absolute inset-0 rounded-full bg-cyan-300/10 animate-pulse"></div>
                            </button>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default EditorDashboard;
