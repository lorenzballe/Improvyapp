import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { RefreshCw, Lock, Globe, Smartphone, Gift, Copy, Check, Link2, Tag, Wallet } from "lucide-react";
import { creatorDashboard, type CreatorDashboard, type CreatorExample, type CreatorSale } from "../lib/firebase";

/**
 * A creator's private page: improvy.app/#creator/{ref}/{key}.
 *
 * What their audience bought — on the site and in the apps — and what each
 * sale earned them, straight from the server each time it opens. Their share
 * is a share of each sale's NET: the price less the VAT inside it and the
 * payment's cost (Stripe's fee on the site, Apple's or Google's commission in
 * the app), and the page shows every step, for every sale. Before the first
 * sale it shows what one would earn, and a slider for a month of them.
 *
 * Until their share has been agreed the page shows no percentage and no
 * commission, only that it is still to be agreed. The key in the address is
 * the only access, so this page loads no analytics (main.tsx) and never puts
 * the address anywhere.
 */

const IT = typeof navigator !== "undefined" && /^it\b/i.test(navigator.language ?? "");

const t = IT
  ? {
      label: "Area creator",
      title: "I tuoi guadagni",
      intro: "Ogni licenza Improvy Pro venduta con il tuo link o con il tuo codice, e quanto ti spetta, in tempo reale.",
      earned: "La tua parte",
      share: (p: number) => `il ${p}% del netto di ogni vendita`,
      open: "Da definire",
      openSub: "La tua percentuale la definiamo insieme",
      sales: "Vendite",
      salesSub: (site: number, app: number) => `${site} dal sito · ${app} dalle app`,
      netTotal: "Netto delle vendite",
      netTotalSub: "dopo IVA e commissioni",
      tools: "Il tuo link e il tuo codice",
      linkLabel: "Link",
      linkSub: "Chi compra da qui ha già lo sconto",
      codeLabel: "Codice sconto",
      codeSub: "10% per chi compra, sul sito e nell'app",
      copy: "Copia",
      copied: "Copiato",
      proCode: "Il tuo codice Pro gratuito",
      used: (u: number, m: number) => `usato ${u} su ${m}`,
      perSale: "Quanto guadagni con una vendita",
      perSaleIntro: "Con il tuo codice, per chi compra dall'Italia. Da altri paesi cambia di poco, con la loro IVA.",
      onSite: "Sul sito",
      inApp: "Nell'app",
      price: "Prezzo pagato",
      vat: "IVA",
      stripe: "Commissione di pagamento (Stripe)",
      store: "Commissione di Apple o Google",
      fees: "Commissione",
      net: "Netto",
      yours: (p: number) => `La tua parte (${p}%)`,
      sim: "Se in un mese vendi",
      simUnit: (n: number) => (n === 1 ? "licenza" : "licenze"),
      simSite: "tutte dal sito",
      simApp: "tutte dall'app",
      list: "Le tue vendite",
      none: "Ancora nessuna vendita. Appariranno qui appena qualcuno compra con il tuo link o il tuo codice.",
      refunded: "Rimborsata",
      sources: { site: "Sito", app_store: "App Store", play_store: "Google Play", store: "App" } as Record<string, string>,
      payTitle: "Come ricevi i guadagni",
      pay: "A fine mese ti giro la tua parte con un bonifico, o con PayPal se preferisci. Le vendite rimborsate non contano.",
      updated: "Aggiornato",
      refresh: "Aggiorna",
      loading: "Caricamento…",
      invalid: "Questo link non è valido. Controlla di averlo copiato per intero, o scrivi a Lorenzo.",
      failed: "Non riesco a caricare i dati in questo momento. Riprova tra poco.",
      note: "Il netto è il prezzo pagato meno l'IVA del paese di chi compra e la commissione di Stripe (sul sito) o di Apple e Google (nell'app). Questo link è personale: non condividerlo.",
      noteOpen: "La tua percentuale su ogni vendita è ancora da definire: quando l'avremo concordata, qui vedrai anche quanto ti spetta. Le vendite rimborsate non contano. Questo link è personale: non condividerlo.",
      estimated: "stima",
      locale: "it-IT",
    }
  : {
      label: "Creator area",
      title: "Your earnings",
      intro: "Every Improvy Pro licence sold through your link or your code, and what you are owed, live.",
      earned: "Your share",
      share: (p: number) => `${p}% of the net of every sale`,
      open: "To be agreed",
      openSub: "We'll set your share together",
      sales: "Sales",
      salesSub: (site: number, app: number) => `${site} on the site · ${app} in the apps`,
      netTotal: "Net of your sales",
      netTotalSub: "after VAT and fees",
      tools: "Your link and your code",
      linkLabel: "Link",
      linkSub: "Buyers from here get the discount already",
      codeLabel: "Discount code",
      codeSub: "10% off for buyers, on the site and in the app",
      copy: "Copy",
      copied: "Copied",
      proCode: "Your free Pro code",
      used: (u: number, m: number) => `${u} of ${m} used`,
      perSale: "What one sale earns you",
      perSaleIntro: "With your code, for a buyer in Italy. Elsewhere it differs a little, with their VAT.",
      onSite: "On the site",
      inApp: "In the app",
      price: "Price paid",
      vat: "VAT",
      stripe: "Payment fee (Stripe)",
      store: "Apple's or Google's commission",
      fees: "Fee",
      net: "Net",
      yours: (p: number) => `Your share (${p}%)`,
      sim: "If in a month you sell",
      simUnit: (n: number) => (n === 1 ? "licence" : "licences"),
      simSite: "all on the site",
      simApp: "all in the app",
      list: "Your sales",
      none: "No sales yet. They will show up here as soon as someone buys with your link or your code.",
      refunded: "Refunded",
      sources: { site: "Website", app_store: "App Store", play_store: "Google Play", store: "App" } as Record<string, string>,
      payTitle: "How you get paid",
      pay: "At the end of each month I send you your share by bank transfer, or PayPal if you prefer. Refunded sales don't count.",
      updated: "Updated",
      refresh: "Refresh",
      loading: "Loading…",
      invalid: "This link is not valid. Check it was copied in full, or write to Lorenzo.",
      failed: "Couldn't load your numbers right now. Try again in a moment.",
      note: "The net is the price paid less the VAT of the buyer's country and the fee of Stripe (on the site) or Apple and Google (in the app). This link is personal: please don't share it.",
      noteOpen: "Your share of each sale is still to be agreed: once it is, you will see what you are owed here too. Refunded sales don't count. This link is personal: please don't share it.",
      estimated: "estimate",
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
          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-black/30 p-5">
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
  const pct = data.pct;
  const earnings = data.totals.earnings ?? [];
  const eur = earnings.find((r) => r.currency === "eur");
  const others = earnings.filter((r) => r.currency !== "eur");
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {pct == null ? (
          <Stat label={t.earned} value={t.open} sub={t.openSub} highlight compact />
        ) : (
          <Stat
            label={t.earned}
            value={money(eur?.commission ?? 0, "eur")}
            sub={t.share(pct)}
            highlight
            extra={others.map((r) => money(r.commission ?? 0, r.currency))}
          />
        )}
        <Stat label={t.sales} value={String(data.totals.sales)} sub={t.salesSub(data.totals.site, data.totals.app)} />
        <Stat
          label={t.netTotal}
          value={money(eur?.net ?? 0, "eur")}
          sub={t.netTotalSub}
          extra={others.map((r) => money(r.net, r.currency))}
        />
      </div>

      <Tools data={data} />

      {pct != null && data.examples ? <PerSale pct={pct} site={data.examples.site} app={data.examples.app} /> : null}

      <Sales data={data} busy={busy} onRefresh={onRefresh} />

      <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-black/25 p-5">
        <Wallet className="w-4 h-4 text-[#e5a93c] mt-0.5 shrink-0" />
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{t.payTitle}</div>
          <p className="text-sm text-zinc-300 leading-relaxed">{t.pay}</p>
        </div>
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
    <div className={`rounded-2xl border p-5 ${highlight ? "border-[#e5a93c]/40 bg-[#e5a93c]/[0.07]" : "border-white/[0.08] bg-black/30"}`}>
      <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{label}</div>
      {/* A word, not a figure, sits a size down so it holds one line in the card. */}
      <div className={`mt-2 ${compact ? "text-2xl leading-9" : "text-3xl"} font-black font-display ${highlight ? "text-[#e5a93c]" : "text-white"}`}>{value}</div>
      {extra.length ? <div className="text-xs text-zinc-300 mt-0.5">+ {extra.join(" + ")}</div> : null}
      <div className="mt-1 text-[11px] text-zinc-400">{sub}</div>
    </div>
  );
}

function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{children}</h2>
      {aside}
    </div>
  );
}

/** Their link and their code, each a tap from the clipboard, and their free-Pro code's use. */
function Tools({ data }: { data: CreatorDashboard }) {
  const link = `Improvy.app/${data.ref}`;
  const code = `${data.ref.toUpperCase()}10`;
  return (
    <div className="space-y-3">
      <SectionTitle>{t.tools}</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CopyRow icon={<Link2 className="w-4 h-4" />} label={t.linkLabel} value={link} copyText={`https://improvy.app/${data.ref}`} sub={t.linkSub} />
        <CopyRow icon={<Tag className="w-4 h-4" />} label={t.codeLabel} value={code} copyText={code} sub={t.codeSub} />
      </div>
      {data.proCode ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3">
          <Gift className="w-4 h-4 text-[#e5a93c] shrink-0" />
          <div className="text-xs text-zinc-300">
            {t.proCode} <span className="font-bold text-white">{data.proCode.code}</span> · {t.used(data.proCode.uses, data.proCode.maxUses)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CopyRow({ icon, label, value, copyText, sub }: { icon: ReactNode; label: string; value: string; copyText: string; sub: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* A browser that refuses the clipboard still shows the text to copy by hand. */
    }
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/30 px-4 py-3.5">
      <span className="text-[#e5a93c] shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{label}</div>
        <div className="text-base font-bold text-white truncate select-all">{value}</div>
        <div className="text-[11px] text-zinc-400">{sub}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white/25 cursor-pointer shrink-0"
      >
        {done ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        {done ? t.copied : t.copy}
      </button>
    </div>
  );
}

/** What one sale earns, on the site and in the app, every step shown; then a month of them. */
function PerSale({ pct, site, app }: { pct: number; site: CreatorExample; app: CreatorExample }) {
  const [n, setN] = useState(20);
  return (
    <div className="space-y-3">
      <SectionTitle>{t.perSale}</SectionTitle>
      <p className="text-xs text-zinc-400 leading-relaxed -mt-1">{t.perSaleIntro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Breakdown title={t.onSite} icon={<Globe className="w-4 h-4" />} pct={pct} x={site} feeLabel={t.stripe} />
        <Breakdown title={t.inApp} icon={<Smartphone className="w-4 h-4" />} pct={pct} x={app} feeLabel={t.store} />
      </div>
      <div className="rounded-2xl border border-[#e5a93c]/25 bg-[#e5a93c]/[0.04] p-5 space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm text-zinc-300">{t.sim}</span>
          <span className="text-2xl font-black font-display text-white tabular-nums">{n}</span>
          <span className="text-sm text-zinc-300">{t.simUnit(n)}</span>
        </div>
        <input
          type="range"
          min={1}
          max={200}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          aria-label={t.sim}
          className="w-full accent-[#e5a93c] cursor-pointer"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{t.simSite}</div>
            <div className="text-2xl font-black font-display text-[#e5a93c] tabular-nums">{money(site.share * n, "eur")}</div>
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">{t.simApp}</div>
            <div className="text-2xl font-black font-display text-[#e5a93c] tabular-nums">{money(app.share * n, "eur")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Breakdown({ title, icon, pct, x, feeLabel }: { title: string; icon: ReactNode; pct: number; x: CreatorExample; feeLabel: string }) {
  const row = (label: string, value: string, strong = false) => (
    <div className={`flex items-baseline justify-between gap-3 ${strong ? "text-white font-semibold" : "text-zinc-400"}`}>
      <span className="text-xs">{label}</span>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  );
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5 space-y-2">
      <div className="flex items-center gap-2 pb-1 text-white">
        <span className="text-[#e5a93c]">{icon}</span>
        <span className="text-sm font-black font-display uppercase tracking-wide">{title}</span>
      </div>
      {row(t.price, money(x.price, x.currency))}
      {row(`− ${t.vat}`, money(x.vat, x.currency))}
      {row(`− ${feeLabel}`, money(x.fee, x.currency))}
      <div className="border-t border-white/[0.08] pt-2">{row(t.net, money(x.net, x.currency), true)}</div>
      <div className="flex items-baseline justify-between gap-3 pt-1">
        <span className="text-xs font-bold text-[#e5a93c]">{t.yours(pct)}</span>
        <span className="text-2xl font-black font-display text-[#e5a93c] tabular-nums">{money(x.share, x.currency)}</span>
      </div>
    </div>
  );
}

function Sales({ data, busy, onRefresh }: { data: CreatorDashboard; busy: boolean; onRefresh: () => void }) {
  return (
    <div className="space-y-3">
      <SectionTitle
        aside={
          <button
            type="button"
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-white/25 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${busy ? "animate-spin" : ""}`} />
            {t.refresh}
          </button>
        }
      >
        {t.list}
      </SectionTitle>
      {data.sales.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-sm text-zinc-400 text-center">{t.none}</p>
      ) : (
        <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-black/25">
          {data.sales.map((s, i) => (
            <Fragment key={`${s.at}-${i}`}>
              <SaleRow sale={s} pct={data.pct} />
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}

function SaleRow({ sale, pct }: { sale: CreatorSale; pct: number | null }) {
  const Icon = sale.source === "site" ? Globe : Smartphone;
  const off = sale.refunded || sale.disputed;
  const net = sale.net;
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white">{t.sources[sale.source] ?? sale.source}</div>
        <div className="text-[11px] text-zinc-500">
          {new Date(sale.at).toLocaleDateString(t.locale, { day: "numeric", month: "short", year: "numeric" })}
          {sale.amount != null && sale.currency ? ` · ${money(sale.amount, sale.currency)}` : ""}
          {net ? ` − ${t.vat} ${money(net.vat, net.currency)} − ${t.fees.toLowerCase()} ${money(net.fee, net.currency)}` : ""}
          {net?.estimated ? ` (${t.estimated})` : ""}
        </div>
      </div>
      <div className="text-right">
        {off ? (
          <>
            <div className="text-sm font-semibold text-zinc-500 line-through">{net ? money(net.amount, net.currency) : sale.amount != null && sale.currency ? money(sale.amount, sale.currency) : ""}</div>
            <div className="text-[11px] text-zinc-500">{t.refunded}</div>
          </>
        ) : pct != null && sale.share != null && net ? (
          <>
            <div className="text-sm font-bold text-[#e5a93c]">{money(sale.share, net.currency)}</div>
            <div className="text-[11px] text-zinc-500">
              {t.net} {money(net.amount, net.currency)}
            </div>
          </>
        ) : net ? (
          <>
            <div className="text-sm font-semibold text-white">{money(net.amount, net.currency)}</div>
            <div className="text-[11px] text-zinc-500">{t.net}</div>
          </>
        ) : sale.amount != null && sale.currency ? (
          <div className="text-sm font-semibold text-white">{money(sale.amount, sale.currency)}</div>
        ) : null}
      </div>
    </li>
  );
}
