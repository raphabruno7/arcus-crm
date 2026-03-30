import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';
import enMessages from '@/messages/en.json';
import { KanbanBoard } from '@/features/boards/components/Kanban/KanbanBoard';
import { DealCard } from '@/features/boards/components/Kanban/DealCard';
import { KanbanHeader } from '@/features/boards/components/Kanban/KanbanHeader';
import { BoardSelector } from '@/features/boards/components/BoardSelector';
import { BoardStrategyHeader } from '@/features/boards/components/Kanban/BoardStrategyHeader';
import { DeleteBoardModal } from '@/features/boards/components/Modals/DeleteBoardModal';
import { AIProcessingModal } from '@/features/boards/components/Modals/AIProcessingModal';
import { Board, BoardStage, DealView } from '@/types';

let mockCRM = {
  lifecycleStages: [] as Array<{ id: string; name: string }>,
  deals: [] as DealView[],
  boards: [] as Board[],
  updateBoard: vi.fn(),
  setIsGlobalAIOpen: vi.fn(),
};

vi.mock('@/context/CRMContext', () => ({
  useCRM: () => mockCRM,
}));

const stage: BoardStage = {
  id: 'stage-1',
  label: 'Lead',
  color: 'bg-blue-500',
  order: 0,
  linkedLifecycleStage: undefined,
};

const dealBase: DealView = {
  id: 'deal-1',
  title: 'Acme Deal',
  value: 1000,
  currencyCode: 'BRL',
  status: 'stage-1',
  isWon: false,
  isLost: false,
  tags: [],
  companyName: 'Acme',
  owner: null,
  nextActivity: null,
  priority: 'low',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  boardId: 'board-1',
  contactId: 'contact-1',
  lossReason: null,
};

const activeBoard: Board = {
  id: 'board-1',
  name: 'Sales',
  stages: [],
  color: 'bg-blue-500',
  createdAt: new Date().toISOString(),
};

function wrap(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('KanbanBoard i18n', () => {
  test('renders legacy board description in English when locale is en', () => {
    const boardWithLegacyDescription: Board = {
      ...activeBoard,
      name: '1. Captação / Leads',
      description: 'Parte da jornada: Sim',
    };

    wrap(
      <BoardSelector
        boards={[boardWithLegacyDescription]}
        activeBoard={boardWithLegacyDescription}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /lead capture/i }));
    expect(screen.getAllByText('1. Lead Capture').length).toBeGreaterThan(0);
    expect(screen.getByText('Part of journey: Yes')).toBeInTheDocument();
  });

  test('renders "No deals" in English when column is empty', () => {
    const legacyStage: BoardStage = { ...stage, label: 'Contatado' };
    wrap(
      <KanbanBoard
        stages={[legacyStage]}
        filteredDeals={[]}
        draggingId={null}
        handleDragStart={() => {}}
        handleDragOver={() => {}}
        handleDrop={() => {}}
        setSelectedDealId={() => {}}
        openActivityMenuId={null}
        setOpenActivityMenuId={() => {}}
        handleQuickAddActivity={() => {}}
        setLastMouseDownDealId={() => {}}
      />
    );
    expect(screen.getByText('Contacted')).toBeInTheDocument();
    expect(screen.getByText('No deals')).toBeInTheDocument();
  });

  test('renders "Total:" label in English', () => {
    wrap(
      <KanbanBoard
        stages={[stage]}
        filteredDeals={[dealBase]}
        draggingId={null}
        handleDragStart={() => {}}
        handleDragOver={() => {}}
        handleDrop={() => {}}
        setSelectedDealId={() => {}}
        openActivityMenuId={null}
        setOpenActivityMenuId={() => {}}
        handleQuickAddActivity={() => {}}
        setLastMouseDownDealId={() => {}}
      />
    );
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });
});

describe('DealCard i18n', () => {
  test('renders WON badge in English', () => {
    wrap(
      <DealCard
        deal={{ ...dealBase, isWon: true }}
        isRotting={false}
        activityStatus="none"
        isDragging={false}
        onDragStart={() => {}}
        onSelect={() => {}}
        isMenuOpen={false}
        setOpenMenuId={() => {}}
        onQuickAddActivity={() => {}}
        setLastMouseDownDealId={() => {}}
      />
    );
    expect(screen.getByText('✓ WON')).toBeInTheDocument();
    expect(screen.getByLabelText('Deal won')).toBeInTheDocument();
  });

  test('renders LOST badge in English', () => {
    wrap(
      <DealCard
        deal={{ ...dealBase, isLost: true }}
        isRotting={false}
        activityStatus="none"
        isDragging={false}
        onDragStart={() => {}}
        onSelect={() => {}}
        isMenuOpen={false}
        setOpenMenuId={() => {}}
        onQuickAddActivity={() => {}}
        setLastMouseDownDealId={() => {}}
      />
    );
    expect(screen.getByText('✗ LOST')).toBeInTheDocument();
    expect(screen.getByLabelText('Deal lost')).toBeInTheDocument();
  });
});

describe('KanbanHeader i18n', () => {
  test('renders "New Deal" button and filter options in English', () => {
    wrap(
      <KanbanHeader
        boards={[activeBoard]}
        activeBoard={activeBoard}
        onSelectBoard={() => {}}
        onCreateBoard={() => {}}
        viewMode="kanban"
        setViewMode={() => {}}
        searchTerm=""
        setSearchTerm={() => {}}
        ownerFilter="all"
        setOwnerFilter={() => {}}
        statusFilter="open"
        setStatusFilter={() => {}}
        onNewDeal={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /new deal/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Open' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Owners' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter deals or companies...')).toBeInTheDocument();
  });
});

describe('DeleteBoardModal i18n', () => {
  test('renders title and cancel button in English', () => {
    wrap(
      <DeleteBoardModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        boardName="Sales"
        dealCount={0}
        availableBoards={[]}
        onSelectTargetBoard={() => {}}
      />
    );
    expect(screen.getByRole('heading', { name: 'Delete Board' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});

describe('AIProcessingModal i18n', () => {
  test('renders structure phase title in English', () => {
    wrap(<AIProcessingModal isOpen={true} currentStep="analyzing" phase="structure" />);
    expect(screen.getByText('Creating your CRM')).toBeInTheDocument();
    expect(screen.getByText('Analyzing your business...')).toBeInTheDocument();
  });

  test('renders strategy phase title in English', () => {
    wrap(<AIProcessingModal isOpen={true} currentStep="analyzing" phase="strategy" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Defining Strategy' })).toBeInTheDocument();
    expect(screen.getByText('Reading Board Context...')).toBeInTheDocument();
  });
});

describe('BoardStrategyHeader i18n', () => {
  test('renders strategy labels in English', () => {
    const strategyBoard: Board = {
      ...activeBoard,
      goal: {
        targetValue: '100',
        type: 'number',
        kpi: 'MQLs',
        description: 'Lead generation objective',
      },
      agentPersona: {
        name: 'Closer',
        role: 'Captação e Qualificação',
        behavior: 'Direct and consultative',
      },
      entryTrigger: 'Leads vindos de ads, orgânico, direct, WhatsApp ou página de captura.',
    };

    mockCRM = {
      ...mockCRM,
      boards: [strategyBoard],
      deals: [],
    };

    wrap(<BoardStrategyHeader board={strategyBoard} />);

    expect(screen.getByText('Goal')).toBeInTheDocument();
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Entry')).toBeInTheDocument();
    expect(screen.getByText('Capture and Qualification')).toBeInTheDocument();
    expect(screen.getAllByText('Leads from ads, organic, direct, WhatsApp, or landing page.').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /talk/i })).toBeInTheDocument();
  });
});
