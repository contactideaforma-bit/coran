"use client";

import {
  ACCENTS,
  FONDS,
  POLICES,
  RECITATEURS,
  TAILLES,
  usePrefs,
} from "@/lib/prefs";
import {
  Cadenas,
  Etincelles,
  Lune,
  Micro,
  Soleil,
} from "@/components/Icones";

export default function Personnalisation({
  ouvert,
  fermer,
}: {
  ouvert: boolean;
  fermer: () => void;
}) {
  const { prefs, maj } = usePrefs();

  if (!ouvert) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
      onClick={fermer}
    >
      <div
        className="card pop max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <span style={{ color: "var(--accent)" }}>
              <Etincelles taille={20} />
            </span>
            Personnaliser mon appli
          </h2>
          <button
            onClick={fermer}
            className="card rounded-full px-3 py-1 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Thème */}
        <p className="mb-2 text-sm font-bold">Thème</p>
        <div className="flex gap-2">
          {[
            { dark: false, label: "Clair", icone: <Soleil taille={18} /> },
            { dark: true, label: "Sombre", icone: <Lune taille={18} /> },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => maj({ dark: t.dark })}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold transition active:scale-95"
              style={{
                borderColor:
                  prefs.dark === t.dark ? "var(--accent)" : "var(--border)",
                backgroundColor:
                  prefs.dark === t.dark ? "var(--accent)" : "var(--card)",
                color: prefs.dark === t.dark ? "#fff" : "var(--text)",
              }}
            >
              {t.icone}
              {t.label}
            </button>
          ))}
        </div>

        {/* Couleur de fond (mode clair) */}
        <p className="mb-2 mt-5 text-sm font-bold">
          Couleur de fond{" "}
          <span className="font-normal" style={{ color: "var(--muted)" }}>
            (mode clair)
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          {FONDS.map((f) => (
            <button
              key={f.id}
              onClick={() => maj({ fond: f.id, dark: false })}
              className="flex flex-col items-center gap-1 transition active:scale-95"
              aria-label={`Fond ${f.nom}`}
            >
              <span
                className="h-11 w-11 rounded-full border-4 transition"
                style={{
                  backgroundColor: f.bg,
                  borderColor:
                    prefs.fond === f.id && !prefs.dark
                      ? "var(--accent)"
                      : "var(--border)",
                }}
              />
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {f.nom}
              </span>
            </button>
          ))}
        </div>

        {/* Couleur d'accent */}
        <p className="mb-2 mt-5 text-sm font-bold">Couleur d&apos;accent</p>
        <div className="flex flex-wrap gap-3">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              onClick={() => maj({ accent: a.id })}
              className="flex flex-col items-center gap-1 transition active:scale-95"
              aria-label={`Accent ${a.nom}`}
            >
              <span
                className="h-11 w-11 rounded-full border-4 transition"
                style={{
                  backgroundColor: prefs.dark ? a.sombre : a.clair,
                  borderColor:
                    prefs.accent === a.id ? "var(--text)" : "var(--border)",
                }}
              />
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {a.nom}
              </span>
            </button>
          ))}
        </div>

        {/* Taille du texte */}
        <p className="mb-2 mt-5 text-sm font-bold">Taille du texte</p>
        <div className="flex gap-2">
          {TAILLES.map((t, i) => (
            <button
              key={t.label}
              onClick={() => maj({ taille: i })}
              className="rounded-xl border px-4 py-2 font-bold transition active:scale-95"
              style={{
                borderColor:
                  prefs.taille === i ? "var(--accent)" : "var(--border)",
                backgroundColor:
                  prefs.taille === i ? "var(--accent)" : "var(--card)",
                color: prefs.taille === i ? "#fff" : "var(--text)",
                fontSize: `${0.8 + i * 0.15}rem`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Police arabe */}
        <p className="mb-2 mt-5 text-sm font-bold">Police arabe</p>
        <div className="flex flex-wrap gap-2">
          {POLICES.map((f) => (
            <button
              key={f.id}
              onClick={() => maj({ police: f.id })}
              className={`rounded-xl border px-4 py-2 transition active:scale-95 ${f.id}`}
              style={{
                borderColor:
                  prefs.police === f.id ? "var(--accent)" : "var(--border)",
                backgroundColor:
                  prefs.police === f.id ? "var(--accent)" : "var(--card)",
                color: prefs.police === f.id ? "#fff" : "var(--text)",
              }}
            >
              <span className="arabic text-xl leading-none">بسم الله</span>
              <span className="ml-2 text-xs font-semibold">{f.nom}</span>
            </button>
          ))}
        </div>

        {/* Récitateur */}
        <p className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-bold">
          <Micro taille={16} /> Récitateur
        </p>
        <div className="space-y-2">
          {RECITATEURS.map((r) => (
            <button
              key={r.id}
              onClick={() => maj({ recitateur: r.id })}
              className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[0.99]"
              style={{
                borderColor:
                  prefs.recitateur === r.id ? "var(--accent)" : "var(--border)",
                backgroundColor:
                  prefs.recitateur === r.id
                    ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                    : "var(--card)",
              }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                style={{
                  borderColor:
                    prefs.recitateur === r.id
                      ? "var(--accent)"
                      : "var(--border)",
                }}
              >
                {prefs.recitateur === r.id && (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </span>
              <span>
                <span className="block font-bold">{r.nom}</span>
                <span
                  className="block text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  {r.detail}
                </span>
              </span>
            </button>
          ))}
        </div>

        <p
          className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs"
          style={{ color: "var(--muted)" }}
        >
          <Cadenas taille={14} /> Ces réglages sont enregistrés sur cet
          appareil uniquement — chacun garde les siens.
        </p>
      </div>
    </div>
  );
}
