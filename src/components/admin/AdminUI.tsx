import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5"><h2 className="text-xl font-bold text-slate-950">{title}</h2><button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button></div><div className="p-6">{children}</div></div></div>
}
export function StatusBadge({ children, tone = 'slate' }: { children: ReactNode; tone?: 'green' | 'blue' | 'amber' | 'red' | 'slate' }) {
  const colors = { green: 'bg-emerald-100 text-emerald-800', blue: 'bg-blue-100 text-blue-800', amber: 'bg-amber-100 text-amber-800', red: 'bg-rose-100 text-rose-800', slate: 'bg-slate-100 text-slate-700' }
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>
}
export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) { return <div className="rounded-3xl bg-white p-6 shadow-soft"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-brand">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold text-slate-950">{title}</h1></div>{action}</div></div> }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-600">{label}</span>{children}</label> }
export function Empty({ children }: { children: ReactNode }) { return <div className="p-12 text-center text-sm text-slate-500">{children}</div> }
