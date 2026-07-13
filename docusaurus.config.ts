import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {DOCS_GITHUB_ORG as GITHUB_ORG, DOCS_GITHUB_REPO as GITHUB_REPO} from './src/constants/github';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Webmail',
  tagline: 'A fast, modern, open-source webmail client.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },


  url: 'https://webmail-docs.yukthi.net',
  baseUrl: '/',

  organizationName: GITHUB_ORG,
  projectName: GITHUB_REPO,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // No explicit `id` — this is the "default" docs instance. The search
          // plugin's navbar SearchBar hardcodes a lookup against the default-id
          // instance, so this one has to stay unnamed even though it's UI-specific.
          path: 'docs/ui',
          routeBasePath: 'docs/ui',
          sidebarPath: './sidebars.ts',
          editUrl: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/tailwind.css', './src/css/custom.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'docs/api',
        routeBasePath: 'docs/api',
        sidebarPath: './sidebarsApi.ts',
        editUrl: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/tree/main/`,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'worker',
        path: 'docs/worker',
        routeBasePath: 'docs/worker',
        sidebarPath: './sidebarsWorker.ts',
        editUrl: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/tree/main/`,
      },
    ],
    './plugins/tailwind-config.js',
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        // Index all three docs plugin instances, not just the default one.
        docsRouteBasePath: ['docs/ui', 'docs/api', 'docs/worker'],
        indexBlog: false,
        indexPages: true,
      },
    ],
  ],

  themeConfig: {
    // TODO: replace with a real social card once branding/screenshots are final.
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Webmail',
      logo: {
        alt: 'Webmail Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'Docs',
          position: 'left',
          items: [
            {label: 'UI', to: '/docs/ui'},
            {label: 'API', to: '/docs/api'},
            {label: 'RMQ Worker', to: '/docs/worker'},
          ],
        },
        {to: '/open-source', label: 'Open Source', position: 'left'},
        {
          href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'UI', to: '/docs/ui'},
            {label: 'API', to: '/docs/api'},
            {label: 'RMQ Worker', to: '/docs/worker'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Open Source & Contributing', to: '/open-source'},
            {
              label: 'GitHub Discussions',
              href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/discussions`,
            },
            {
              label: 'Issues',
              href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/issues`,
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`,
            },
          ],
        },
      ],
      copyright: `Copyright © 2026 Yukthi Systems Private Limited. Webmail is free software, licensed under the GNU General Public License v3.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
