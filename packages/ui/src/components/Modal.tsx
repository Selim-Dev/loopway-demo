'use client';

import * as React from 'react';
import styles from './Modal.module.css';
import { Icon, type IconName } from '../icons/Icon';
import { Field, TextArea } from './Forms';

/* ==========================================================================
   Modal
   ========================================================================== */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  /** 720px instead of 480px — for a document review or a wide form. */
  wide?: boolean;
  /** Buttons. Rendered on the RTL-left of the footer. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function Modal({ open, onClose, title, subtitle, wide, footer, children }: ModalProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Esc closes; focus moves into the dialog on open and the page behind it
  // stops scrolling while it is up.
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.scrim}
      onMouseDown={(e) => {
        // Only a click that both starts and ends on the scrim dismisses —
        // dragging a text selection out of the dialog must not close it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={wide ? `${styles.modal} ${styles.modalWide}` : styles.modal}
        style={{ outline: 'none' }}
      >
        <div className={styles.head}>
          <div className={styles.headText}>
            <div className={styles.title}>{title}</div>
            {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          </div>
          <button type="button" className={styles.close} onClick={onClose} title="إغلاق" aria-label="إغلاق">
            <Icon name="close" size={16} strokeWidth={2} />
          </button>
        </div>

        {children != null ? <div className={`${styles.body} lw-scroll`}>{children}</div> : null}

        {footer ? <div className={styles.foot}>{footer}</div> : null}
      </div>
    </div>
  );
}

/* ==========================================================================
   Modal buttons
   ========================================================================== */

export function ModalButton({
  children,
  onClick,
  variant = 'ghost',
  disabled = false,
  icon,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'ghost' | 'primary' | 'danger';
  disabled?: boolean;
  icon?: IconName;
  type?: 'button' | 'submit';
}) {
  const cls = [
    styles.btn,
    variant === 'primary' ? styles.btnPrimary : '',
    variant === 'danger' ? styles.btnDanger : '',
    variant === 'ghost' ? styles.btnGhost : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </button>
  );
}

/* ==========================================================================
   ConfirmDialog
   ========================================================================== */

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Receives the reason when `reasonRequired` is set, otherwise an empty string. */
  onConfirm: (reason: string) => void;
  title: string;
  /** One or two sentences on what is about to happen and to whom. */
  body: React.ReactNode;
  tone?: 'default' | 'danger' | 'warning';
  confirmLabel: string;
  cancelLabel?: string;
  /**
   * Renders a required reason field and keeps the confirm button disabled
   * until it has content. This is how "no silent rejects" is enforced —
   * see docs/design-system/10-admin-portal-guide.md.
   */
  reasonRequired?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  /** Optional strip: counts, totals, anything the operator should re-read. */
  summary?: React.ReactNode;
}

const TONE_GLYPH: Record<NonNullable<ConfirmDialogProps['tone']>, { icon: IconName; cls: string }> = {
  danger: { icon: 'warning', cls: styles.glyphDanger },
  warning: { icon: 'warning', cls: styles.glyphWarning },
  default: { icon: 'check', cls: styles.glyphDefault },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  tone = 'default',
  confirmLabel,
  cancelLabel = 'إلغاء',
  reasonRequired = false,
  reasonLabel = 'سبب القرار',
  reasonPlaceholder = 'اذكر السبب بوضوح — سيظهر لصاحب الطلب وفي سجل التدقيق.',
  summary,
}: ConfirmDialogProps) {
  const [reason, setReason] = React.useState('');

  // Clear between openings so a previous reason never leaks into a new decision.
  React.useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const blocked = reasonRequired && reason.trim().length === 0;
  const glyph = TONE_GLYPH[tone];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={body}
      footer={
        <>
          <ModalButton
            variant={tone === 'danger' ? 'danger' : 'primary'}
            disabled={blocked}
            onClick={() => onConfirm(reason.trim())}
          >
            {confirmLabel}
          </ModalButton>
          <ModalButton onClick={onClose}>{cancelLabel}</ModalButton>
        </>
      }
    >
      <span className={`${styles.glyph} ${glyph.cls}`} aria-hidden="true">
        <Icon name={glyph.icon} size={22} />
      </span>

      {summary ? <div className={styles.summary}>{summary}</div> : null}

      {reasonRequired ? (
        <div style={{ marginTop: 16 }}>
          <Field
            label={reasonLabel}
            required
            htmlFor="confirm-reason"
            help={blocked ? 'السبب إلزامي — لا يمكن إتمام القرار بدونه.' : undefined}
            error={blocked}
          >
            <TextArea
              id="confirm-reason"
              value={reason}
              placeholder={reasonPlaceholder}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </div>
      ) : null}
    </Modal>
  );
}
