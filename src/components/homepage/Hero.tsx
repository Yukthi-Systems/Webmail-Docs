import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {AccentText, ArrowIcon, GitHubIcon, Kbd, PrimaryButton, GhostButton} from './shared';
import {DOCS_GITHUB_URL, WEBMAIL_UI_REPO_URL} from '@site/src/constants/github';

const VERSION = 'v2.7.8';

const SCREENSHOT_ALT =
  'The WebMail composer: a rich-text new mail window with a templated update, an attachment, and To/Cc recipient chips';

function HeroMock() {
  const lightScreenshot = useBaseUrl('/img/screenshots/composer-light.png');
  const darkScreenshot = useBaseUrl('/img/screenshots/composer-dark.png');

  return (
    <div className="tw-relative">
      <div className="tw-overflow-hidden tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-shadow-2xl tw-shadow-slate-900/10 tw-transition-transform tw-duration-300 hover:-tw-translate-y-1 dark:tw-border-slate-700 dark:tw-bg-slate-950 dark:tw-shadow-black/40">
        <div className="tw-flex tw-items-center tw-gap-1.5 tw-border-b tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5 dark:tw-border-slate-700 dark:tw-bg-slate-800/60">
          <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
          <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
          <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
          <span className="tw-ml-2.5 tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-0.5 tw-font-mono tw-text-xs tw-text-slate-400 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-500">
            mail.yourcompany.com
          </span>
          <span className="tw-ml-auto tw-hidden tw-items-center tw-gap-1.5 tw-text-xs tw-text-slate-400 dark:tw-text-slate-500 sm:tw-inline-flex">
            <Kbd>c</Kbd> compose
          </span>
        </div>

        <img
          src={lightScreenshot}
          width={943}
          height={644}
          alt={SCREENSHOT_ALT}
          className="tw-block tw-w-full tw-h-auto dark:tw-hidden"
        />
        <img
          src={darkScreenshot}
          width={950}
          height={678}
          alt={SCREENSHOT_ALT}
          className="tw-hidden tw-w-full tw-h-auto dark:tw-block"
        />
      </div>

      {/* Autosave chip — a real composer behavior (see the "Saving…" state next to Send in the screenshot) */}
      <div
        aria-hidden="true"
        className="tw-absolute -tw-left-5 -tw-top-5 tw-hidden tw-animate-float tw-items-center tw-gap-2 tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-px-3.5 tw-py-2.5 tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40 sm:tw-flex">
        <span className="tw-relative tw-flex tw-h-2 tw-w-2">
          <span className="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full tw-bg-emerald-400 tw-opacity-75" />
          <span className="tw-relative tw-inline-flex tw-h-2 tw-w-2 tw-rounded-full tw-bg-emerald-500" />
        </span>
        <span className="tw-text-xs tw-font-semibold tw-text-slate-600 dark:tw-text-slate-300">
          Draft autosaved
        </span>
      </div>

      {/* Quick-preview hover card — a real product feature, shown mid-hover */}
      <div
        aria-hidden="true"
        className="tw-absolute -tw-bottom-16 -tw-right-8 tw-hidden tw-w-52 tw-animate-float tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-p-3.5 tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40 sm:tw-block"
        style={{animationDelay: '-2s'}}>
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
  );
}

export default function Hero(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className="tw-relative tw-isolate tw-overflow-hidden tw-px-4 tw-pb-24 tw-pt-24 sm:tw-px-6 md:tw-pt-32 lg:tw-px-8">
      <div className="homepage-hero-bg" aria-hidden="true" />

      <div className="tw-mx-auto tw-grid tw-max-w-6xl tw-items-center tw-gap-10 lg:tw-gap-14 lg:tw-grid-cols-[48fr_52fr]">
        <div className="tw-min-w-0">
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

          <h1 className="tw-mt-5 tw-font-display tw-text-4xl tw-font-extrabold tw-leading-[1.06] tw-tracking-tight tw-text-slate-900 dark:tw-text-white sm:tw-text-5xl md:tw-text-6xl lg:tw-text-5xl">
            The inbox you'd build
            <br />
            <AccentText>if you had the time.</AccentText>
          </h1>

          <p className="tw-mt-4 tw-max-w-md tw-text-base tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400 lg:tw-max-w-sm xl:tw-max-w-md">
            {siteConfig.tagline} Threaded conversations, a Tiptap-powered composer, and
            server-side Sieve filtering — yours to run, read, and fork.
          </p>

          <div className="tw-mt-7 tw-flex tw-flex-wrap tw-gap-3.5">
            <PrimaryButton to="/docs/ui">
              Get started <ArrowIcon />
            </PrimaryButton>
            <GhostButton to={WEBMAIL_UI_REPO_URL}>
              <GitHubIcon /> View on GitHub
            </GhostButton>
          </div>

          <p className="tw-mt-5 tw-font-mono tw-text-xs tw-tracking-wide tw-text-slate-400 dark:tw-text-slate-500">
            Runs on your servers · Works on every screen · Keyboard-first
          </p>
        </div>

        <div className="tw-min-w-0">
          <HeroMock />
        </div>
      </div>
    </header>
  );
}
