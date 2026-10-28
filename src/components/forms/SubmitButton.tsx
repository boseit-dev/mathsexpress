import { Button, type ButtonProps } from '@/components/ui/Button';

interface SubmitButtonProps extends Omit<ButtonProps, 'type'> {
  /** True while the form is being sent; the button is disabled and shows `pendingLabel`. */
  pending: boolean;
  pendingLabel: string;
}

export function SubmitButton({
  pending,
  pendingLabel,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
