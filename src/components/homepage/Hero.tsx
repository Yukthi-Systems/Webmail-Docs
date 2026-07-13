import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {AccentText, ArrowIcon, GitHubIcon, Kbd, PrimaryButton, GhostButton} from './shared';
import {DOCS_GITHUB_URL} from '@site/src/constants/github';

const VERSION = 'v2.7.8';

const HERO_FOLDERS = [
  {name: 'Inbox', count: 12, active: true},
  {name: 'Flagged', count: 3, active: false},
  {name: 'Deploys', count: 0, active: false},
  {name: 'Invoices', count: 1, active: false},
  {name: 'Sent', count: 0, active: false},
  {name: 'Drafts', count: 2, active: false},
];

const HERO_MAILS = [
  {
    from: 'Priya Nair',
    initials: 'PN',
    subject: 'Q3 infra review — final agenda',
    preview: 'Attached the updated runbook. Can we lock the…',
    time: '09:42',
    unread: true,
    thread: 4,
    flagged: true,
  },
  {
    from: 'GitHub',
    initials: 'GH',
    subject: `[webmail] Release ${VERSION} published`,
    preview: 'Sieve editor fixes, faster thread loading, and…',
    time: '09:31',
    unread: true,
    thread: 1,
    flagged: false,
  },
  {
    from: 'Daniel Kim',
    initials: 'DK',
    subject: 'Re: SSO rollout for the Berlin team',
    preview: 'Threading looks perfect on mobile now. One…',
    time: '08:56',
    unread: false,
    thread: 7,
    flagged: false,
  },
];

function HeroMock() {
  return (
    <div
      role="img"
      aria-label="Preview of the WebMail interface: folder sidebar and a threaded inbox list"
      className="tw-relative tw-overflow-visible tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-text-sm tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40">
      <div className="tw-flex tw-items-center tw-gap-1.5 tw-rounded-t-2xl tw-border-b tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5 dark:tw-border-slate-700 dark:tw-bg-slate-800/60">
        <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
        <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
        <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
        <span className="tw-ml-2.5 tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-0.5 tw-font-mono tw-text-xs tw-text-slate-400 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-500">
          mail.yourcompany.com
        </span>
        <span className="tw-ml-auto tw-hidden tw-items-center tw-gap-1.5 tw-text-xs tw-text-slate-400 dark:tw-text-slate-500 sm:tw-inline-flex">
          <Kbd>?</Kbd> shortcuts
        </span>
      </div>

      <div className="tw-grid tw-grid-cols-[168px_1fr] max-sm:tw-grid-cols-1">
        <aside className="tw-hidden tw-border-r tw-border-slate-200 tw-p-2.5 dark:tw-border-slate-700 sm:tw-block">
          <div className="tw-mb-3 tw-flex tw-items-center tw-justify-between tw-rounded-lg tw-bg-indigo-600 tw-px-3 tw-py-2 tw-font-semibold tw-text-white">
            <span>Compose</span>
            <Kbd>c</Kbd>
          </div>
          <ul className="tw-m-0 tw-list-none tw-space-y-0.5 tw-p-0">
            {HERO_FOLDERS.map((f) => (
              <li
                key={f.name}
                className={
                  'tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-px-2.5 tw-py-1.5 ' +
                  (f.active
                    ? 'tw-bg-indigo-50 tw-font-semibold tw-text-slate-900 dark:tw-bg-indigo-500/10 dark:tw-text-white'
                    : 'tw-text-slate-500 dark:tw-text-slate-400')
                }>
                <i className="tw-h-2 tw-w-2 tw-rounded-sm tw-border tw-border-slate-300 dark:tw-border-slate-600" />
                <span>{f.name}</span>
                {f.count > 0 && (
                  <b className="tw-ml-auto tw-text-xs tw-font-semibold tw-not-italic tw-text-indigo-600 dark:tw-text-indigo-300">
                    {f.count}
                  </b>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <div className="tw-relative tw-p-1.5">
          {HERO_MAILS.map((m, i) => (
            <div
              key={m.subject}
              className={
                'tw-flex tw-items-start tw-gap-2.5 tw-rounded-lg tw-px-3 tw-py-2.5 ' +
                (i === 0 ? 'tw-bg-indigo-50/70 dark:tw-bg-indigo-500/10' : '')
              }>
              <span className="tw-flex tw-h-7 tw-w-7 tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-bg-indigo-600 tw-text-[11px] tw-font-bold tw-text-white">
                {m.initials}
              </span>
              <div className="tw-min-w-0 tw-flex-1">
                <div className="tw-flex tw-items-center tw-gap-2">
                  <strong className="tw-text-[0.8rem] tw-text-slate-900 dark:tw-text-white">
                    {m.from}
                  </strong>
                  {m.thread > 1 && (
                    <em className="tw-rounded-full tw-border tw-border-slate-200 tw-px-1.5 tw-font-mono tw-text-[0.62rem] tw-not-italic tw-text-slate-400 dark:tw-border-slate-700 dark:tw-text-slate-500">
                      {m.thread}
                    </em>
                  )}
                  <time className="tw-ml-auto tw-font-mono tw-text-[0.66rem] tw-text-slate-400 dark:tw-text-slate-500">
                    {m.time}
                  </time>
                </div>
                <p
                  className={
                    'tw-mb-0 tw-mt-0.5 tw-truncate tw-text-[0.78rem] ' +
                    (m.unread
                      ? 'tw-font-bold tw-text-slate-900 dark:tw-text-white'
                      : 'tw-text-slate-600 dark:tw-text-slate-300')
                  }>
                  {m.subject}
                </p>
                <p className="tw-mb-0 tw-truncate tw-text-[0.72rem] tw-text-slate-400 dark:tw-text-slate-500">
                  {m.preview}
                </p>
              </div>
              {m.flagged && (
                <span className="tw-text-amber-500" aria-hidden="true">
                  ⚑
                </span>
              )}
            </div>
          ))}

          {/* Quick-preview hover card — a real product feature, shown mid-hover */}
          <div
            aria-hidden="true"
            className="tw-absolute -tw-bottom-7 -tw-right-5 tw-hidden tw-w-60 tw-animate-float tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-p-3.5 tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40 sm:tw-block">
            <div className="tw-flex tw-items-center tw-gap-2.5">
              <span className="tw-flex tw-h-9 tw-w-9 tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-bg-indigo-600 tw-text-xs tw-font-bold tw-text-white">
                PN
              </span>
              <div className="tw-flex tw-flex-col">
                <strong className="tw-text-[0.8rem] tw-text-slate-900 dark:tw-text-white">
                  Priya Nair
                </strong>
                <span className="tw-font-mono tw-text-[0.68rem] tw-text-slate-400 dark:tw-text-slate-500">
                  priya@yourcompany.com
                </span>
              </div>
            </div>
            <div className="tw-mt-2.5 tw-border-t tw-border-slate-100 tw-pt-2.5 tw-text-[0.7rem] tw-text-slate-400 dark:tw-border-slate-800 dark:tw-text-slate-500">
              Also on this thread: Daniel, Ana +2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className="tw-relative tw-isolate tw-overflow-hidden tw-px-4 tw-pb-24 tw-pt-24 md:tw-pt-32">
      <div className="homepage-hero-bg" aria-hidden="true" />

      <div className="tw-mx-auto tw-grid tw-max-w-6xl tw-items-center tw-gap-14 md:tw-grid-cols-[46%_54%]">
        <div>
          <Link
            to={DOCS_GITHUB_URL}
            className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-slate-300 tw-bg-white tw-px-3.5 tw-py-1.5 tw-font-mono tw-text-xs tw-text-slate-700 tw-no-underline tw-transition hover:tw-border-indigo-400 hover:tw-text-indigo-600 hover:tw-no-underline dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-200">
            <span className="tw-relative tw-flex tw-h-1.5 tw-w-1.5">
              <span className="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full tw-bg-emerald-400 tw-opacity-75" />
              <span className="tw-relative tw-inline-flex tw-h-1.5 tw-w-1.5 tw-rounded-full tw-bg-emerald-500" />
            </span>
            Open source · {VERSION}
            <ArrowIcon />
          </Link>

          <h1 className="tw-mt-5 tw-font-display tw-text-4xl tw-font-extrabold tw-leading-[1.06] tw-tracking-tight tw-text-slate-900 dark:tw-text-white md:tw-text-6xl">
            The inbox you'd build
            <br />
            <AccentText>if you had the time.</AccentText>
          </h1>

          <p className="tw-mt-4 tw-max-w-md tw-text-base tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            {siteConfig.tagline} Threaded conversations, a Tiptap-powered composer, and
            server-side Sieve filtering — yours to run, read, and fork.
          </p>

          <div className="tw-mt-7 tw-flex tw-flex-wrap tw-gap-3.5">
            <PrimaryButton to="/docs/ui">
              Get started <ArrowIcon />
            </PrimaryButton>
            <GhostButton to={DOCS_GITHUB_URL}>
              <GitHubIcon /> View on GitHub
            </GhostButton>
          </div>

          <p className="tw-mt-5 tw-font-mono tw-text-xs tw-tracking-wide tw-text-slate-400 dark:tw-text-slate-500">
            Runs on your servers · Works on every screen · Keyboard-first
          </p>
        </div>

        <div>
          <HeroMock />
        </div>
      </div>
    </header>
  );
}
