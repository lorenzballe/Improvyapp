import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Lock, Globe, Smartphone, Gift } from "lucide-react";
import { creatorDashboard, type CreatorDashboard, type CreatorSale } from "../lib/firebase";

/**
 * A creator's private page: improvy.app/#creator/{ref}/{key}.
 *
 * What their audience bought — on the site and in the apps — and what that
 * earned them, straight from the server each time it opens. Until their share
 * has been agreed with them the page shows no percentage and no commission,
 * only that it is still to be agreed. The key in the address is the only
 * access, so this page loads no analytics (main.tsx) and never puts the
 * address anywhere.
 */

const IT = typeof navigator !== "undefined" && /^it\b/i.test(navigator.language ?? "");

const t = IT
  ? {
      label: "Area creator",
      title: "Le tue vendite",
      intro: "Ogni acquisto di Improvy Pro arrivato dal tuo link o dal tuo codice, aggiornato in tempo reale.",
      sales: "Vendite",
      earned: "La tua commissione",
      revenue: "Incassato",
      share: (p: number) => `${p}% di ogni vendita`,
      open: "Da definire",
      openSub: "La tua percentuale la definiamo insieme",
      site: "dal sito",
      app: "dalle app",
      code: "Codice Pro gratuito",
      used: (u: number, m: number) => `usato ${u} su ${m}`,
      list: "Dettaglio",
      none: "Ancora nessuna vendita. Appariranno qui appena qualcuno compra con il tuo link o il tuo codice.",
      refunded: "Rimborsata",
      sources: { site: "Sito", app_store: "App Store", play_store: "Google Play", store: "App" } as Record<string, string>,
      updated: "Aggiornato",
      refresh: "Aggiorna",
      loading: "Caricamento…",
      invalid: "Questo link non è valido. Controlla di averlo copiato per intero, o scrivi a Lorenzo.",
      failed: "Non riesco a caricare i dati in questo momento. Riprova tra poco.",
      note: "La commissione è calcolata su quanto paga chi compra; le vendite rimborsate non contano. Questo link è personale: non condividerlo.",
      noteOpen: "La tua percentuale su ogni vendita è ancora da definire: quando l'avremo concordata, qui vedrai anche la tua commissione. Le vendite rimborsate non contano. Questo link è personale: non condividerlo.",
      locale: "it-IT",
    }
  : {
      label: "Creator area",
      title: "Your sales",
      intro: "Every Improvy Pro purchase that came from your link or your code, updated live.",
      sales: "Sales",
      earned: "Your commission",
      revenue: "Revenue",
      share: (p: number) => `${p}% of every sale`,
      open: "To be agreed",
      openSub: "We'll set your share together",
      site: "on the site",
      app: "in the apps",
      code: "Free Pro code",
      used: (u: number, m: number) => `${u} of ${m} used`,
      list: "Details",
      none: "No sales yet. They will show up here as soon as someone buys with your link or your code.",
      refunded: "Refunded",
      sources: { site: "Website", app_store: "App Store", play_store: "Google Play", store: "App" } as Record<string, string>,
      updated: "Updated",
      refresh: "Refresh",
      loading: "Loading…",
      invalid: "This link is not valid. Check it was copied in full, or write to Lorenzo.",
      failed: "Couldn't load your numbers right now. Try again in a moment.",
      note: "Commission is worked out on what the buyer paid; refunded sales don't count. This link is personal: please don't share it.",
      noteOpen: "Your share of each sale is still to be agreed: once it is, your commission will show here too. Refunded sales don't count. This link is personal: please don't share it.",
      locale: "en-GB",
    };

function money(minor: number, currency: string) {
  return new Intl.NumberFormat(t.locale, { style: "currency", currency: currency.toUpperCase() }).format(minor / 100);
}

/** #creator/{ref}/{key} → its two parts. */
function fromHash(): { ref: string; key: string } | null {
  const m = window.location.hash.match(/^#\/?creator\/([a-z0-9_-]{2,32})\/([A-Za-z0-9_-]{16,128})$/);
  return m ? { ref: m[1], key: m[2] } : null;
}

export default function CreatorPage() {
  const access = useMemo(fromHash, []);
  const [data, setData] = useState<CreatorDashboard | null>(null);
  const [error, setError] = useState<string | null>(access ? null : t.invalid);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!access) return;
    setBusy(true);
    try {
      setData(await creatorDashboard(access.ref, access.key));
      setError(null);
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "";
      setError(code.includes("permission-denied") ? t.invalid : t.failed);
    } finally {
      setBusy(false);
    }
  }, [access]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-36 text-zinc-300 font-sans relative z-30">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-10 text-left"
      >
        <div className="space-y-4 pb-8 border-b border-white/[0.08]">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">
            {t.label}
            {data ? ` · ${data.ref}` : ""}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.1]">
            {t.title}
          </h1>
          <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xl">{t.intro}</p>
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <Lock className="w-4 h-4 text-[#e5a93c] mt-0.5 shrink-0" />
            <p className="text-sm text-zinc-300">{error}</p>
          </div>
        ) : !data ? (
          <p className="text-sm text-zinc-500" aria-busy="true">{t.loading}</p>
        ) : (
          <Dashboard data={data} busy={busy} onRefresh={load} />
        )}
      </motion.div>
    </div>
  );
}

function Dashboard({ data, busy, onRefresh }: { data: CreatorDashboard; busy: boolean; onRefresh: () => void }) {
  const eur = data.totals.revenue.find((r) => r.currency === "eur");
  const others = data.totals.revenue.filter((r) => r.currency !== "eur");
  const pct = data.pct;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {pct == null ? (
          <Stat label={t.earned} value={t.open} sub={t.openSub} highlight compact />
        ) : (
          <Stat label={t.earned} value={money(eur?.commission ?? 0, "eur")} sub={t.share(pct)} highlight extra={others.map((r) => money(r.commission ?? 0, r.currency))} />
        )}
        <Stat label={t.sales} value={String(data.totals.sales)} sub={`${data.totals.site} ${t.site} · ${data.totals.app} ${t.app}`} />
        <Stat label={t.revenue} value={money(eur?.amount ?? 0, "eur")} sub="Improvy Pro" extra={others.map((r) => money(r.amount, r.currency))} />
      </div>

      {data.proCode ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
          <Gift className="w-4 h-4 text-[#e5a93c] shrink-0" />
          <div className="text-xs text-zinc-300">
            {t.code} <span className="font-bold text-white">{data.proCode.code}</span> · {t.used(data.proCode.uses, data.proCode.maxUses)}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{t.list}</h2>
          <button
            type="button"
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white/25 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${busy ? "animate-spin" : ""}`} />
            {t.refresh}
          </button>
        </div>
        {data.sales.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-sm text-zinc-400 text-center">{t.none}</p>
        ) : (
          <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-white/[0.02]">
            {data.sales.map((s, i) => (
              <Fragment key={`${s.at}-${i}`}>
                <SaleRow sale={s} pct={pct} />
              </Fragment>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-1 text-[11px] text-zinc-500 leading-relaxed">
        <p>{pct == null ? t.noteOpen : t.note}</p>
        <p>
          {t.updated}: {new Date(data.updatedAt).toLocaleString(t.locale)}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, highlight, compact, extra = [] }: { label: string; value: string; sub: string; highlight?: boolean; compact?: boolean; extra?: string[] }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-[#e5a93c]/40 bg-[#e5a93c]/[0.07]" : "border-white/[0.08] bg-white/[0.03]"}`}>
      <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{label}</div>
      {/* A word, not a figure, sits a size down so it holds one line in the card. */}
      <div className={`mt-2 ${compact ? "text-2xl leading-9" : "text-3xl"} font-black font-display ${highlight ? "text-[#e5a93c]" : "text-white"}`}>{value}</div>
      {extra.length ? <div className="text-xs text-zinc-300 mt-0.5">+ {extra.join(" + ")}</div> : null}
      <div className="mt-1 text-[11px] text-zinc-400">{sub}</div>
    </div>
  );
}

function SaleRow({ sale, pct }: { sale: CreatorSale; pct: number | null }) {
  const Icon = sale.source === "site" ? Globe : Smartphone;
  const off = sale.refunded || sale.disputed;
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white">{t.sources[sale.source] ?? sale.source}</div>
        <div className="text-[11px] text-zinc-500">{new Date(sale.at).toLocaleDateString(t.locale, { day: "numeric", month: "short", year: "numeric" })}</div>
      </div>
      <div className="text-right">
        {sale.amount != null && sale.currency ? (
          pct == null ? (
            // No share agreed yet: the sale itself, and nothing worked out from it.
            <>
              <div className={`text-sm font-semibold ${off ? "text-zinc-500 line-through" : "text-white"}`}>{money(sale.amount, sale.currency)}</div>
              {off ? <div className="text-[11px] text-zinc-500">{t.refunded}</div> : null}
            </>
          ) : (
            <>
              <div className={`text-sm font-semibold ${off ? "text-zinc-500 line-through" : "text-white"}`}>
                {money(Math.round((sale.amount * pct) / 100), sale.currency)}
              </div>
              <div className="text-[11px] text-zinc-500">{off ? t.refunded : money(sale.amount, sale.currency)}</div>
            </>
          )
        ) : null}
      </div>
    </li>
  );
}
