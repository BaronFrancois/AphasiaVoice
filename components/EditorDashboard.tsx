import React, { useMemo, useState } from 'react';
import { ArrowLeft, ShieldCheck, Activity, History, SlidersHorizontal, LockKeyhole, LayoutDashboard, Tile, LogOut } from 'lucide-react';

const MAX_WIDTH = 'max-w-[420px]';
const ACCENT = 'from-cyan-500 to-teal-500';

const historyPreview = [
  { time: '10:42', tile: 'AIDE', page: 'Besoins' },
  { time: '10:37', tile: 'BOIRE', page: 'Besoins' },
  { time: '10:28', tile: 'TRISTE', page: 'Émotions' },
];

const usageSpark = [6, 9, 4, 7, 10, 8, 5];

const getMotorHelper = (v: number) => {
  if (v <= 3) return 'Very low motor control – use XXL tiles, big spacing, long-press to validate.';
  if (v <= 6) return 'Moderate motor control – large tiles, normal spacing.';
  return 'Good motor control – normal tile size.';
};

const getCompHelper = (v: number) => {
  if (v <= 3) return 'Very limited understanding – basic vital needs only.';
  if (v <= 6) return 'Simple communication – simple icons and words.';
  return 'Advanced understanding – allow categories, mini sentences and phrase builder.';
};

const computeProfile = (m: number, c: number) => {
  const motricity =
    m <= 3 ? 'Very low motricity' : m <= 6 ? 'Moderate motricity' : 'High motricity';
  const comprehension =
    c <= 3 ? 'Low comprehension' : c <= 6 ? 'Moderate comprehension' : 'High comprehension';

  let uiLevel = 'XL tiles';
  if (m >= 7) uiLevel = 'Normal tiles';
  else if (m >= 4) uiLevel = 'Large tiles';

  let uxLevel = 'Basic';
  if (c >= 7) uxLevel = 'Advanced';
  else if (c >= 4) uxLevel = 'Simple';

  const summary = `${motricity} / ${comprehension} → ${uiLevel} + ${uxLevel.toLowerCase()} comms.`;
  return { summary, uiLevel, uxLevel };
};

const Card: React.FC<{ title: string; icon?: React.ReactNode; subtitle?: string; children: React.ReactNode }> = ({
  title,
  icon,
  subtitle,
  children,
}) => (
  <section className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] px-4 py-5 text-slate-100">
    <div className="flex items-start gap-3">
      <div className="mt-1 text-cyan-400">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        </div>
        {subtitle && <p className="text-sm text-slate-400 mt-1 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 border border-slate-700">
    {children}
  </span>
);

interface EditorDashboardProps {
  onExit: () => void;
  onOpenBoard?: () => void;
}

const EditorDashboard: React.FC<EditorDashboardProps> = ({ onExit, onOpenBoard }) => {
  const [motor, setMotor] = useState(4);
  const [comp, setComp] = useState(7);

  const profile = useMemo(() => computeProfile(motor, comp), [motor, comp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050810] via-[#0a0f1a] to-[#101520] text-white">
      <div className={`mx-auto w-full ${MAX_WIDTH} px-4 pb-28 pt-4 space-y-4`}>
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
              <div className="text-base font-semibold">Tableau de bord</div>
              <div className="text-xs text-slate-400">Mode modifieur</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 text-cyan-400">
              <ShieldCheck size={22} />
            </div>
          </div>
        </header>

        {/* Activity & History */}
        <Card
          title="Activité & historique"
          icon={<Activity size={18} />}
          subtitle="Aperçu des dernières actions et tendance d’usage."
        >
          <button className="w-full rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 text-slate-100 font-semibold py-3 px-4 flex items-center justify-center gap-2 active:scale-97 transition">
            <History size={18} />
            Ouvrir l’historique complet
          </button>
          <div className="mt-4 space-y-2">
            {historyPreview.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2 text-sm text-slate-200"
              >
                <span className="text-slate-400">{item.time}</span>
                <span className="font-semibold">{item.tile}</span>
                <span className="text-slate-400 text-xs">{item.page}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-end gap-1 h-16">
              {usageSpark.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-slate-700 to-cyan-500"
                  style={{ height: `${v * 10}%`, minHeight: '8px' }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">Usage sur les 7 derniers jours (mock).</p>
          </div>
        </Card>

        {/* Motor & Cognitive profile */}
        <Card
          title="Profil moteur & cognitif"
          icon={<SlidersHorizontal size={18} />}
          subtitle="Ajustez les niveaux M et C (0-10) pour adapter l’UI/UX."
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-100">Motricité (M)</span>
                <Pill>{motor}</Pill>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={motor}
                onChange={(e) => setMotor(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-xs text-slate-400">{getMotorHelper(motor)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-100">Compréhension (C)</span>
                <Pill>{comp}</Pill>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={comp}
                onChange={(e) => setComp(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-xs text-slate-400">{getCompHelper(comp)}</p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3 space-y-2">
              <p className="text-sm font-semibold text-slate-100">Profil calculé</p>
              <p className="text-xs text-slate-300 leading-relaxed">{profile.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Pill>UI level: {profile.uiLevel.toUpperCase()}</Pill>
                <Pill>UX level: {profile.uxLevel.toUpperCase()}</Pill>
              </div>
            </div>
          </div>
        </Card>

        {/* Complexity suggestion */}
        <Card
          title="Suggestion de niveau de complexité"
          icon={<LayoutDashboard size={18} />}
          subtitle="Basé sur l’usage (mock) des 7 derniers jours."
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Niveau suggéré :</span>
              <Pill>Communication enrichie</Pill>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Basé sur les 7 derniers jours (faible taux d’erreur, bonne diversité), nous suggérons
              de tester le niveau « Communication enrichie ».
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-semibold py-3 px-4 active:scale-97 transition">
                Appliquer le niveau suggéré
              </button>
              <button className="w-full rounded-2xl bg-slate-800 text-slate-100 font-semibold py-3 px-4 border border-slate-700 active:scale-97 transition">
                Garder le niveau actuel
              </button>
            </div>
          </div>
        </Card>

        {/* Tiles & layouts */}
        <Card
          title="Tuiles & mise en page"
          icon={<Tile size={18} />}
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
              Prévisualiser l’UI pour ce profil
            </button>
          </div>
        </Card>

        {/* Security & export */}
        <Card
          title="Sécurité & export"
          icon={<LockKeyhole size={18} />}
          subtitle="Options de protection et d’export des données."
        >
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-3">
              <span>Changer le code PIN</span>
              <Pill>Action</Pill>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-3">
              <span>Auto-logout après 30s d’inactivité</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700">
                <div className="absolute left-5 h-5 w-5 rounded-full bg-cyan-400 shadow" />
              </div>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-3">
              <span>Exporter données (JSON / CSV)</span>
              <Pill>Exporter</Pill>
            </li>
          </ul>
        </Card>
      </div>

      {/* Footer pill */}
      <footer className="fixed inset-x-0 bottom-0 pb-3 flex justify-center">
        <div
          className={`w-[92%] ${MAX_WIDTH} px-2`}
        >
          <div className="mx-auto flex items-center justify-center">
            <button className="flex items-center gap-3 rounded-full px-4 py-3 w-full justify-center text-slate-900 font-semibold shadow-[0_20px_50px_-25px_rgba(0,255,255,0.6)] bg-gradient-to-r from-cyan-500 to-teal-500 active:scale-98 transition relative overflow-hidden">
              <span className="h-10 w-10 rounded-full bg-slate-900/20 flex items-center justify-center text-slate-900">
                <ShieldCheck size={22} />
              </span>
              <span className="text-base tracking-tight">Modifier</span>
              <div className="absolute inset-0 rounded-full bg-cyan-300/10 animate-pulse"></div>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EditorDashboard;
