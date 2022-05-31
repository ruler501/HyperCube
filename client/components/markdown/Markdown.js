import { lazy } from 'react';

import ErrorBoundary from '@cubeartisan/client/components/containers/ErrorBoundary.js';
import ExternalLink from '@cubeartisan/client/components/markdown/ExternalLink.js';
import MarkdownCardImage from '@cubeartisan/client/components/markdown/MarkdownCardImage.js';
import MarkdownCardLink from '@cubeartisan/client/components/markdown/MarkdownCardLink.js';
import Suspense from '@cubeartisan/client/components/wrappers/Suspense.js';

const GenericMarkdown = lazy(() => import('@cubeartisan/markdown'));

const Markdown = (props) => (
  <ErrorBoundary>
    <Suspense>
      <GenericMarkdown
        {...props}
        ExternalLink={ExternalLink}
        CardImage={MarkdownCardImage}
        CardLink={MarkdownCardLink}
      />
    </Suspense>
  </ErrorBoundary>
);

export default Markdown;
