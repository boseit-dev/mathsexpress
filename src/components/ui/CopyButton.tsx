import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from './Button';
import { VisuallyHidden } from './VisuallyHidden';

interface CopyButtonProps {
  text: string;
  label: string;
}

/** Copies text to the clipboard and confirms it, also to screen readers. */
export function CopyButton({ text, label }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status === 'idle') return undefined;
    const timer = window.setTimeout(() => {
      setStatus('idle');
    }, 2500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => void copy()}>
        <Copy />
        {status === 'copied' ? 'Copied' : label}
      </Button>
      <span role="status">
        <VisuallyHidden>
          {status === 'copied' ? 'Copied to the clipboard.' : ''}
          {status === 'failed' ? 'Could not copy. Select the code and copy it instead.' : ''}
        </VisuallyHidden>
      </span>
    </>
  );
}
