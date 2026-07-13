import type {ReactNode} from 'react';
import {AccentText, SectionHead} from './shared';

const THREAD_MSGS = [
  {who: 'DK', text: 'SSO rollout plan attached — thoughts?'},
  {who: 'PN', text: 'Login flow works. One redirect issue on mobile.'},
  {who: 'DK', text: 'Fixed in v2.7.8, shipping tonight.'},
];

const MORE_FEATURES = [
  'Advanced search',
  'Drag & drop to folders',
  'Nested folders with colors',
  'Light / dark themes',
  'Mobile-responsive layout',
  'Quick sender preview',
  'Shared folders via IMAP ACLs',
];

const cardBase =
  'tw-flex tw-flex-col tw-gap-2.5 tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-p-6 tw-transition hover:-tw-translate-y-1 hover:tw-border-indigo-300 dark:tw-border-slate-800 dark:tw-bg-slate-900 dark:hover:tw-border-indigo-500/50';

export default function Features(): ReactNode {
  return (
    <section className="tw-mx-auto tw-max-w-6xl tw-px-4 tw-py-24">
      <SectionHead
        eyebrow="Everything mail should do"
        title={
          <>
            Serious features, <AccentText>zero lock-in</AccentText>
          </>
        }
        lede="The workflows you expect from a paid client — running on infrastructure you control."
      />

      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-7`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Conversations that stay together
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Replies, forwards, and follow-ups are grouped into a single thread, in order.
            Open any message and the whole history is right there.
          </p>
          <div className="tw-mt-2 tw-flex tw-flex-col tw-gap-2.5" aria-hidden="true">
            {THREAD_MSGS.map((m, i) => (
              <div
                key={m.text}
                style={{marginLeft: i * 18}}
                className="tw-flex tw-max-w-md tw-items-center tw-gap-2.5 tw-rounded-lg tw-border tw-border-slate-100 tw-bg-slate-50 tw-px-3.5 tw-py-2.5 dark:tw-border-slate-800 dark:tw-bg-slate-800/50">
                <span className="tw-flex tw-h-7 tw-w-7 tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-bg-indigo-600 tw-text-[11px] tw-font-bold tw-text-white">
                  {m.who}
                </span>
                <p className="tw-m-0 tw-text-sm tw-text-slate-700 dark:tw-text-slate-200">
                  {m.text}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-5`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Sieve filters, server-side
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Rules run on the server, not in a tab — mail is sorted before any client sees
            it.
          </p>
          <pre
            aria-label="Example Sieve filter script"
            className="tw-mt-2 tw-overflow-x-auto tw-rounded-lg tw-border tw-border-slate-100 tw-bg-slate-50 tw-p-4 tw-font-mono tw-text-xs tw-leading-relaxed tw-text-slate-700 dark:tw-border-slate-800 dark:tw-bg-slate-800/50 dark:tw-text-slate-200">
            {`require ["fileinto", "imap4flags"];

if address :domain "from" "github.com" {
  addflag "\\\\Flagged";
  fileinto "Deploys";
}`}
          </pre>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-4`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            A composer with range
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Rich formatting, attachments, and reusable templates — powered by Tiptap.
          </p>
          <div
            aria-hidden="true"
            className="tw-mt-auto tw-overflow-hidden tw-rounded-lg tw-border tw-border-slate-100 dark:tw-border-slate-800">
            <div className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-slate-100 tw-bg-slate-50 tw-px-3.5 tw-py-2 tw-text-sm tw-text-slate-400 dark:tw-border-slate-800 dark:tw-bg-slate-800/50 dark:tw-text-slate-500">
              <b>B</b>
              <i>I</i>
              <u>U</u>
              <span>🔗</span>
              <span>📎</span>
              <em className="tw-ml-auto tw-rounded-full tw-bg-indigo-50 tw-px-2.5 tw-py-0.5 tw-font-mono tw-text-[0.7rem] tw-not-italic tw-text-indigo-600 dark:tw-bg-indigo-500/10 dark:tw-text-indigo-300">
                Template ▾
              </em>
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2 tw-p-3.5">
              <span className="tw-h-2 tw-w-[82%] tw-rounded tw-bg-slate-100 dark:tw-bg-slate-800" />
              <span className="tw-h-2 tw-w-[64%] tw-rounded tw-bg-slate-100 dark:tw-bg-slate-800" />
              <span className="tw-h-2 tw-w-[73%] tw-rounded tw-bg-slate-100 dark:tw-bg-slate-800" />
            </div>
          </div>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-4`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Templates, saved once
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Save your best replies as reusable templates, then insert one from the
            composer toolbar in a click.
          </p>
          <div
            aria-hidden="true"
            className="tw-mt-auto tw-overflow-hidden tw-rounded-lg tw-border tw-border-slate-100 dark:tw-border-slate-800">
            {['Meeting follow-up', 'Invoice reminder', 'Welcome email'].map((t, i) => (
              <div
                key={t}
                className={
                  'tw-flex tw-items-center tw-gap-2 tw-px-3.5 tw-py-2 tw-text-sm ' +
                  (i === 0
                    ? 'tw-bg-indigo-50 tw-text-indigo-700 dark:tw-bg-indigo-500/10 dark:tw-text-indigo-300'
                    : 'tw-text-slate-500 dark:tw-text-slate-400') +
                  (i > 0 ? ' tw-border-t tw-border-slate-100 dark:tw-border-slate-800' : '')
                }>
                <span aria-hidden="true">📄</span>
                {t}
              </div>
            ))}
          </div>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-4`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Contacts at your cursor
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Hover a sender to see who they are and what's recent. Full address book in
            the sidebar — create, edit, and search instantly.
          </p>
          <div
            aria-hidden="true"
            className="tw-mt-auto tw-flex tw-items-center tw-gap-2.5 tw-rounded-lg tw-border tw-border-slate-100 tw-bg-slate-50 tw-px-3.5 tw-py-3 dark:tw-border-slate-800 dark:tw-bg-slate-800/50">
            <span className="tw-flex tw-h-8 tw-w-8 tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-bg-indigo-600 tw-text-xs tw-font-bold tw-text-white">
              AS
            </span>
            <div className="tw-flex tw-flex-col">
              <strong className="tw-text-[0.82rem] tw-text-slate-900 dark:tw-text-white">
                Ana Souza
              </strong>
              <span className="tw-font-mono tw-text-[0.68rem] tw-text-slate-400 dark:tw-text-slate-500">
                ana@yourcompany.com
              </span>
            </div>
          </div>
        </article>
      </div>

      <ul className="tw-mx-auto tw-mt-7 tw-flex tw-list-none tw-flex-wrap tw-gap-2.5 tw-p-0">
        {MORE_FEATURES.map((f) => (
          <li
            key={f}
            className="tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-3.5 tw-py-1.5 tw-text-sm tw-font-medium tw-text-slate-500 dark:tw-border-slate-800 dark:tw-bg-slate-900 dark:tw-text-slate-400">
            {f}
          </li>
        ))}
      </ul>
    </section>
  );
}
