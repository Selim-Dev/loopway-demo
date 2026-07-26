'use client';

import * as React from 'react';
import styles from './Forms.module.css';
import { Icon, type IconName } from '../icons/Icon';

/* ==========================================================================
   FormGrid / Field
   ========================================================================== */

export function FormGrid({
  columns = 2,
  children,
}: {
  columns?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <div className={columns === 1 ? `${styles.formGrid} ${styles.formGridWide}` : styles.formGrid}>
      {children}
    </div>
  );
}

export interface FieldProps {
  label: string;
  required?: boolean;
  help?: React.ReactNode;
  /** Renders `help` in danger red — for validation messages. */
  error?: boolean;
  /** Span both columns of a two-column FormGrid. */
  wide?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export function Field({ label, required, help, error, wide, htmlFor, children }: FieldProps) {
  return (
    <div className={wide ? `${styles.field} ${styles.fieldWide}` : styles.field}>
      <label className={styles.fieldLabel} htmlFor={htmlFor}>
        {label} {required ? <span className={styles.required}>*</span> : null}
      </label>
      {children}
      {help ? <span className={error ? `${styles.help} ${styles.helpError}` : styles.help}>{help}</span> : null}
    </div>
  );
}

/* ==========================================================================
   Controls
   ========================================================================== */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Numerals, amounts and reference codes stay LTR — see 03-typography-rtl.md. */
  ltr?: boolean;
  /** Trailing unit rendered inside the control (%, ر.س). */
  unit?: string;
};

export function TextInput({ ltr, unit, className, ...rest }: InputProps) {
  const input = (
    <input
      {...rest}
      className={[styles.control, ltr ? styles.controlLtr : '', className].filter(Boolean).join(' ')}
    />
  );

  if (!unit) return input;

  return (
    <div className={styles.controlWrap}>
      {input}
      <span className={styles.unit}>{unit}</span>
    </div>
  );
}

export function TextArea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={[styles.control, styles.textarea, className].filter(Boolean).join(' ')} />;
}

/**
 * Select styled to match the form controls.
 * NOTE: this is the *form* select. `SelectField` in Controls.tsx is the
 * shorter filter-bar select with its own chevron — they are not interchangeable.
 */
export function FormSelect({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={[styles.control, className].filter(Boolean).join(' ')}>
      {children}
    </select>
  );
}

/* ==========================================================================
   ChoiceCard
   ========================================================================== */

export function ChoiceRow({ columns = 2, children }: { columns?: 2 | 3; children: React.ReactNode }) {
  return (
    <div className={`${styles.choiceRow} ${columns === 3 ? styles.choiceRow3 : styles.choiceRow2}`}>
      {children}
    </div>
  );
}

export function ChoiceCard({
  title,
  body,
  icon,
  selected = false,
  onSelect,
  badge,
}: {
  title: string;
  body?: React.ReactNode;
  icon?: IconName;
  selected?: boolean;
  onSelect?: () => void;
  /** Rendered inline after the title — e.g. a "موصى بها" StatusBadge. */
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={selected ? `${styles.choice} ${styles.choiceActive}` : styles.choice}
      onClick={onSelect}
      aria-pressed={selected}
    >
      {icon ? (
        <span className={styles.choiceGlyph}>
          <Icon name={icon} size={22} />
        </span>
      ) : null}
      <span className={styles.choiceMain}>
        <span className={styles.choiceTitle}>
          {title}
          {badge ? <span style={{ marginRight: 8 }}>{badge}</span> : null}
        </span>
        {body ? <span className={styles.choiceBody}>{body}</span> : null}
      </span>
    </button>
  );
}

/* ==========================================================================
   Toggle — NEW. No switch exists in the design source.
   ========================================================================== */

export function Toggle({
  checked,
  onChange,
  label,
  help,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** When given, renders the full label + help row with the switch on the left. */
  label?: string;
  help?: React.ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      className={checked ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleKnob} />
    </button>
  );

  if (!label) return control;

  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleText}>
        <span className={styles.toggleLabel}>{label}</span>
        {help ? <span className={styles.toggleHelp}>{help}</span> : null}
      </span>
      {control}
    </div>
  );
}

/* ==========================================================================
   Checkbox — NEW. Drives bulk selection in the payout queue.
   ========================================================================== */

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  checked: boolean;
  /** Header checkbox when some — but not all — rows are selected. */
  indeterminate?: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  const className = [
    styles.checkbox,
    indeterminate ? styles.checkboxIndeterminate : checked ? styles.checkboxChecked : '',
  ]
    .filter(Boolean)
    .join(' ');

  const control = (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      {indeterminate ? <span className={styles.dash} /> : checked ? <Icon name="check" size={12} strokeWidth={3} /> : null}
    </button>
  );

  if (!label) return control;

  return (
    <span className={styles.checkboxRow}>
      {control}
      <span className={styles.checkboxLabel}>{label}</span>
    </span>
  );
}
