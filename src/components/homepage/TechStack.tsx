import type {ReactNode} from 'react';

const GROUPS: {label: string; items: string[]}[] = [
  {label: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Tiptap']},
  {label: 'Backend', items: ['Python', 'FastAPI', 'PostgreSQL']},
  {label: 'Infra', items: ['Go', 'RabbitMQ', 'Sieve / ManageSieve']},
];

export default function TechStack(): ReactNode {
  return (
    <section className="tw-border-y tw-border-slate-200 tw-bg-slate-50 tw-px-4 tw-py-7 dark:tw-border-slate-800 dark:tw-bg-slate-900/40 sm:tw-px-6 lg:tw-px-8">
      <div className="tw-mx-auto tw-flex tw-max-w-6xl tw-flex-wrap tw-items-center tw-gap-x-10 tw-gap-y-4">
        <span className="tw-flex-none tw-font-mono tw-text-xs tw-font-semibold tw-uppercase tw-tracking-widest tw-text-slate-400 dark:tw-text-slate-500">
          Under the hood
        </span>
        {GROUPS.map((group) => (
          <div key={group.label} className="tw-flex tw-flex-wrap tw-items-center tw-gap-2.5">
            <span className="tw-font-mono tw-text-[0.7rem] tw-uppercase tw-tracking-wide tw-text-indigo-600 dark:tw-text-indigo-300">
              {group.label}
            </span>
            {group.items.map((item) => (
              <span
                key={item}
                className="tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-1 tw-font-mono tw-text-xs tw-font-medium tw-text-slate-600 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-300">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
