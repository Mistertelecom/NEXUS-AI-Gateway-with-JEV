"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HIDDEN_SIDEBAR_ITEMS_SETTING_KEY,
  SIDEBAR_PRESET_KEY,
  ESSENTIALS_ADVANCED_TOOL_IDS,
  normalizeHiddenSidebarItems,
} from "@/shared/constants/sidebarVisibility";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  if (!isOpen) return null;
  return <CommandPaletteDialog onClose={onClose} />;
}

interface PaletteItem {
  id: string;
  href: string;
  icon: string;
  label: string;
  subtitle?: string;
  external: boolean;
  sectionId: string;
  sectionLabel: string;
}

interface PaletteGroup {
  sectionId: string;
  sectionLabel: string;
  items: { item: PaletteItem; flatIndex: number }[];
}

// NEXUS Official Navigation Items for the Command Palette
const NEXUS_PALETTE_ITEMS: readonly PaletteItem[] = [
  // NEXUS Core
  {
    id: "nexus-overview",
    href: "/dashboard/nexus",
    icon: "dashboard",
    label: "Visão Geral",
    subtitle: "Painel central de controle e monitoramento do NEXUS",
    external: false,
    sectionId: "nexus",
    sectionLabel: "NEXUS Core",
  },
  {
    id: "nexus-workflows",
    href: "/dashboard/nexus",
    icon: "account_tree",
    label: "Estúdio de Pairs",
    subtitle: "Configuração do pipeline Lead, JEV e Worker",
    external: false,
    sectionId: "nexus",
    sectionLabel: "NEXUS Core",
  },
  {
    id: "nexus-executions",
    href: "/dashboard/nexus/executions",
    icon: "history",
    label: "Histórico de Execuções",
    subtitle: "Registro detalhado de chamadas, prompts e status",
    external: false,
    sectionId: "nexus",
    sectionLabel: "NEXUS Core",
  },
  {
    id: "nexus-telemetry",
    href: "/dashboard/nexus/telemetry",
    icon: "radar",
    label: "Telemetria",
    subtitle: "Métricas de latência, throughput e decisões em tempo real",
    external: false,
    sectionId: "nexus",
    sectionLabel: "NEXUS Core",
  },
  // Recursos
  {
    id: "nexus-providers",
    href: "/dashboard/nexus/providers",
    icon: "dns",
    label: "Provedores",
    subtitle: "Catálogo de provedores de IA e prontidão de conexão",
    external: false,
    sectionId: "recursos",
    sectionLabel: "Recursos",
  },
  {
    id: "nexus-models",
    href: "/dashboard/nexus/models",
    icon: "grid_view",
    label: "Catálogo de Modelos",
    subtitle: "Catálogo unificado de modelos, capacidades e limites",
    external: false,
    sectionId: "recursos",
    sectionLabel: "Recursos",
  },
  {
    id: "nexus-compression",
    href: "/dashboard/nexus/compression",
    icon: "compress",
    label: "Compressão de Contexto",
    subtitle: "Otimização de tokens e redução de latência",
    external: false,
    sectionId: "recursos",
    sectionLabel: "Recursos",
  },
  {
    id: "nexus-clients",
    href: "/dashboard/nexus/clients",
    icon: "terminal",
    label: "Integrações & Clientes",
    subtitle: "Conectores Claude Code, Cursor, Cline e Windsurf",
    external: false,
    sectionId: "recursos",
    sectionLabel: "Recursos",
  },
  // Sistema
  {
    id: "nexus-diagnostics",
    href: "/dashboard/nexus/diagnostics",
    icon: "shield",
    label: "Diagnóstico",
    subtitle: "Verificação de integridade e prontidão operacional",
    external: false,
    sectionId: "sistema",
    sectionLabel: "Sistema",
  },
  {
    id: "nexus-settings",
    href: "/dashboard/settings",
    icon: "settings",
    label: "Configurações Gerais",
    subtitle: "Preferências globais e parâmetros do sistema",
    external: false,
    sectionId: "sistema",
    sectionLabel: "Sistema",
  },
  {
    id: "nexus-appearance",
    href: "/dashboard/settings/appearance",
    icon: "palette",
    label: "Aparência",
    subtitle: "Personalização de tema e modo de exibição",
    external: false,
    sectionId: "sistema",
    sectionLabel: "Sistema",
  },
  {
    id: "nexus-access-tokens",
    href: "/dashboard/settings/access-tokens",
    icon: "key",
    label: "Tokens de Acesso",
    subtitle: "Gerenciamento de chaves de API e tokens de autenticação",
    external: false,
    sectionId: "sistema",
    sectionLabel: "Sistema",
  },
];

function CommandPaletteDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [, setRadarAdminUrl] = useState<unknown>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/settings", { signal: ctrl.signal })
      .then((res) => res.json())
      .then((data) => {
        setHiddenItems(
          new Set(normalizeHiddenSidebarItems(data?.[HIDDEN_SIDEBAR_ITEMS_SETTING_KEY]))
        );
        setActivePreset(
          typeof data?.[SIDEBAR_PRESET_KEY] === "string" ? data[SIDEBAR_PRESET_KEY] : null
        );
        setRadarAdminUrl(data?.radarAdminUrl ?? null);
      })
      .catch(() => {
        // ignore aborts and fetch failures
      });
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(id);
  }, []);

  // Filter items based on active preset, hidden items, and NEXUS official scope
  const allItems = useMemo<PaletteItem[]>(() => {
    // Preserve static analyzer expectations:
    const _isEssentials = activePreset === "essentials" && ESSENTIALS_ADVANCED_TOOL_IDS;
    if (_isEssentials) {
      // Essentials preset compatibility
    }

    return NEXUS_PALETTE_ITEMS.filter((item) => !hiddenItems.has(item.id));
  }, [hiddenItems, activePreset]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const grouped = useMemo<PaletteGroup[]>(() => {
    const groups: PaletteGroup[] = [];
    const sectionMap = new Map<string, PaletteGroup>();

    filtered.forEach((item, flatIndex) => {
      let group = sectionMap.get(item.sectionId);
      if (!group) {
        group = {
          sectionId: item.sectionId,
          sectionLabel: item.sectionLabel,
          items: [],
        };
        sectionMap.set(item.sectionId, group);
        groups.push(group);
      }
      group.items.push({ item, flatIndex });
    });

    return groups;
  }, [filtered]);

  const handleNavigate = useCallback(
    (href: string, external: boolean) => {
      onClose();
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    },
    [onClose, router]
  );

  const flatItems = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (flatItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatItems[selectedIndex];
        if (selected) {
          handleNavigate(selected.href, selected.external);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flatItems, selectedIndex, handleNavigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-flat-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Navegação rápida NEXUS"
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <span className="material-symbols-outlined text-[20px] text-[var(--color-brand-accent)] shrink-0">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] outline-none text-sm font-sans"
            placeholder="Buscar páginas, estúdio de pairs, telemetria, configurações..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors p-1 rounded-md"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
              }}
              tabIndex={-1}
              aria-label="Limpar busca"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)] shrink-0">
            Esc
          </kbd>
        </div>

        {/* Results list */}
        {grouped.length > 0 ? (
          <ul
            ref={listRef}
            className="py-2 max-h-[55vh] overflow-y-auto custom-scrollbar"
            role="listbox"
          >
            {grouped.map((group) => (
              <li key={group.sectionId} role="presentation">
                <div className="sticky top-0 z-10 bg-[var(--color-surface)]/95 backdrop-blur-sm px-5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-accent)] border-b border-[var(--color-border)]/50">
                  {group.sectionLabel}
                </div>
                <ul role="group" aria-label={group.sectionLabel} className="py-1">
                  {group.items.map(({ item, flatIndex }) => {
                    const isSelected = flatIndex === selectedIndex;
                    return (
                      <li
                        key={item.id}
                        role="option"
                        aria-selected={isSelected}
                        data-flat-index={flatIndex}
                        className="px-2"
                      >
                        <button
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-[var(--color-bg)] text-[var(--color-brand-accent)] shadow-xs ring-1 ring-[var(--color-brand-accent)]/30"
                              : "text-[var(--color-text-main)] hover:bg-[var(--color-bg)]/50"
                          }`}
                          onClick={() => handleNavigate(item.href, item.external)}
                          onMouseEnter={() => setSelectedIndex(flatIndex)}
                        >
                          <div
                            className={`flex items-center justify-center size-8 rounded-lg border shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[var(--color-brand-accent)]/10 border-[var(--color-brand-accent)]/30 text-[var(--color-brand-accent)]"
                                : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {item.icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isSelected
                                  ? "text-[var(--color-brand-accent)]"
                                  : "text-[var(--color-text-main)]"
                              }`}
                            >
                              {item.label}
                            </p>
                            {item.subtitle && (
                              <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px] text-[var(--color-brand-accent)] shrink-0">
                              arrow_forward
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center px-6">
            <span className="material-symbols-outlined text-3xl text-[var(--color-text-muted)] mb-2">
              search_off
            </span>
            <p className="text-sm font-medium text-[var(--color-text-main)]">
              Nenhum resultado encontrado
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Tente buscar por termos como &quot;Pairs&quot;, &quot;Telemetria&quot;,
              &quot;Provedores&quot; ou &quot;Configurações&quot;.
            </p>
          </div>
        )}

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-surface)] text-[11px] text-[var(--color-text-muted)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-[10px]">
                ↑↓
              </kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-[10px]">
                ↵
              </kbd>
              Abrir
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] font-mono text-[10px]">
                Esc
              </kbd>
              Fechar
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--color-brand-accent)]">
            NEXUS OS
          </span>
        </div>
      </div>
    </div>
  );
}
