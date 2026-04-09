'use client';

import { AssetStatus, AssetType, STATUS_LABELS } from '@/types/accounts';

export type FilterType = 'all' | AssetType;
export type SortKey = 'name' | 'balance' | 'updatedAt';
export type SortDir = 'asc' | 'desc';

interface FilterBarProps {
  filterType: FilterType;
  filterStatus: AssetStatus | 'all';
  sortKey: SortKey;
  sortDir: SortDir;
  onFilterType: (v: FilterType) => void;
  onFilterStatus: (v: AssetStatus | 'all') => void;
  onSortKey: (v: SortKey) => void;
  onSortDir: (v: SortDir) => void;
  totalCount: number;
  filteredCount: number;
}

const TYPE_OPTIONS: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '銀行', value: 'bank' },
  { label: '股票', value: 'stock' },
  { label: '加密貨幣', value: 'crypto' },
];

const STATUS_OPTIONS: { label: string; value: AssetStatus | 'all' }[] = [
  { label: '全部狀態', value: 'all' },
  { label: '啟用', value: 'enabled' },
  { label: '閒置', value: 'idle' },
  { label: '異常', value: 'abnormal' },
  { label: '待處理', value: 'pending' },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: '名稱', value: 'name' },
  { label: '金額', value: 'balance' },
  { label: '更新時間', value: 'updatedAt' },
];

export default function FilterBar({
  filterType,
  filterStatus,
  sortKey,
  sortDir,
  onFilterType,
  onFilterStatus,
  onSortKey,
  onSortDir,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        padding: '16px 20px',
        background: 'var(--bg-surface)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        marginBottom: 24,
      }}
    >
      {/* Filter by type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>類別</span>
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterType(opt.value)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s',
              background: filterType === opt.value ? 'var(--gold-dim)' : 'transparent',
              color: filterType === opt.value ? 'var(--gold)' : 'var(--text-secondary)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: filterType === opt.value ? 'var(--border-gold)' : 'transparent',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      {/* Filter by status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>狀態</span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterStatus(opt.value)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s',
              background: filterStatus === opt.value ? 'var(--gold-dim)' : 'transparent',
              color: filterStatus === opt.value ? 'var(--gold)' : 'var(--text-secondary)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: filterStatus === opt.value ? 'var(--border-gold)' : 'transparent',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      {/* Sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>排序</span>
        <select
          value={sortKey}
          onChange={(e) => onSortKey(e.target.value as SortKey)}
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={() => onSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--gold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'all 0.15s',
          }}
          title={sortDir === 'asc' ? '遞增' : '遞減'}
        >
          {sortDir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Count */}
      <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
        {filteredCount !== totalCount
          ? <span>顯示 {filteredCount} / {totalCount} 筆</span>
          : <span>{totalCount} 筆帳戶</span>}
      </div>
    </div>
  );
}
