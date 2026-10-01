<!-- togo-header -->
# @togo-framework/ui-marketing

> [!WARNING]
> **Deprecated.** This package is no longer maintained. togo now uses
> [Nasaq](https://nasaq.fadymondy.com) (`@fadymondy/nasaq`) as its default UI kit:
> new apps from `create-togo-app` and the official plugins are built on it.
> Install it with `npm i @fadymondy/nasaq` and import from `@fadymondy/nasaq/web`.

Landing/docs/marketing page components (`Marketing`, `Glass`, `Marketplace`,
`Docs`, `Terminal`, `ClaudeSession`, `BrowserFrame`) plus the
dynamic editable section board (`SectionBoard`). Part of the togo UI kit.

```bash
npm install @togo-framework/ui-marketing
```

```tsx
import { DocsLayout, MarketplaceCard, ClaudeSession } from "@togo-framework/ui-marketing";
```

Requires `@togo-framework/ui-core` and `@togo-framework/ui-markdown` (docs
pages render markdown via the shared renderer).
<!-- togo-sponsors -->
