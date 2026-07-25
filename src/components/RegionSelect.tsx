import { useEffect, useId, useRef, useState } from "react";
import { REGIONS } from "../domain";
import { findNextMatch } from "../lib/type-ahead";
import { RegionFlag } from "./RegionFlag";

interface Props {
  value: string;
  onChange: (region: string) => void;
}

const REGION_LABELS = REGIONS.map((region) => region.name);

/**
 * Community picker. A native <select> cannot render the flags inside its
 * options, so this is the ARIA combobox pattern instead: the button keeps
 * focus while open and `aria-activedescendant` points at the highlighted
 * option, so no focus juggling is needed.
 */
export function RegionSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    REGIONS.findIndex((region) => region.id === value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  // Clicking anywhere outside closes without changing the selection.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view while navigating with the keyboard.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const select = (index: number) => {
    onChange(REGIONS[index].id);
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Jump to the next community matching the typed letter; pressing it again
  // cycles through the rest.
  const jumpToLetter = (letter: string) => {
    const from = open ? activeIndex : selectedIndex;
    const match = findNextMatch(REGION_LABELS, letter, from);
    if (match === null) return;

    setActiveIndex(match);
    if (!open) setOpen(true);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((index) =>
          Math.min(REGIONS.length - 1, Math.max(0, index + step)),
        );
        return;
      }
      case "Home":
      case "End": {
        if (!open) return;
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? 0 : REGIONS.length - 1);
        return;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        if (open) select(activeIndex);
        else openList();
        return;
      }
      case "Escape": {
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        return;
      }
      case "Tab": {
        setOpen(false);
        return;
      }
      default: {
        if (event.key.length === 1 && /\p{L}/u.test(event.key)) {
          event.preventDefault();
          jumpToLetter(event.key);
        }
      }
    }
  };

  const selected = REGIONS[selectedIndex];

  return (
    <div className="field region-select" ref={rootRef}>
      <span className="field__label" id={labelId}>
        Comunidad autónoma
      </span>

      <button
        type="button"
        ref={buttonRef}
        className="region-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <RegionFlag regionId={selected.id} />
        <span className="region-select__value">{selected.name}</span>
        <svg
          className="region-select__caret"
          viewBox="0 0 12 12"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          className="region-select__list"
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          ref={listRef}
        >
          {REGIONS.map((region, index) => (
            <li
              key={region.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              data-active={index === activeIndex}
              className="region-select__option"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(index)}
            >
              <RegionFlag regionId={region.id} />
              <span>{region.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
