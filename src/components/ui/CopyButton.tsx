import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from './Button';
import styles from './CopyButton.module.css';

interface CopyButtonProps {
  text: string;
  label: string;
}

/** Copies text to the clipboard and says whether it worked, on screen and to screen readers. */
export function CopyButton({ text, label }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (status !== 'copied') return undefined;
    const timer = window.setTimeout(() => {
      setStatus('idle');
    }, 2500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [status]);

  async function copy() {
    try {
      // Missing outside secure (https) pages, and some browsers refuse permission.
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <div className={styles.copy}>
      <Button variant="secondary" onClick={() => void copy()}>
        <Copy />
        {status === 'copied' ? 'Copied' : label}
      </Button>
      <p role="status" className={status === 'failed' ? styles.problem : styles.visuallyHidden}>
        {status === 'copied' && 'Copied to the clipboard.'}
        {status === 'failed' && 'Couldn’t copy. Select the code and copy it instead.'}
      </p>
    </div>
  );
}
