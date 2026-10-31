import { formatDate, toDateInput } from "@/lib/dates";
import { formatCurrency } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export type HarvestSummary = {
  id: string;
  name: string;
  crop: string | null;
  status: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  totalCents: number;
  expenseCount: number;
};

export async function getHarvestSummaries(): Promise<HarvestSummary[]> {
  const harvests = await prisma.harvest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      expenses: { select: { amountCents: true } },
    },
  });

  return harvests.map((harvest) => {
    const { expenses, ...rest } = harvest;
    return {
      ...rest,
      totalCents: expenses.reduce((sum, expense) => sum + expense.amountCents, 0),
      expenseCount: expenses.length,
    };
  });
}

export type ExpenseView = {
  id: string;
  amountCents: number;
  amountLabel: string;
  dateISO: string;
  dateLabel: string;
  description: string | null;
  category: { id: string; name: string; color: string };
};

export type HarvestDetailData = {
  id: string;
  name: string;
  crop: string | null;
  status: string;
  startDate: Date;
  endDate: Date | null;
  notes: string | null;
  totalCents: number;
  expenses: ExpenseView[];
};

export type CategoryOption = { id: string; name: string; color: string };

export async function getHarvestDetail(id: string) {
  const [harvest, categories] = await Promise.all([
    prisma.harvest.findUnique({
      where: { id },
      include: {
        expenses: {
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
          include: { category: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true },
    }),
  ]);

  if (!harvest) return null;

  const expenses: ExpenseView[] = harvest.expenses.map((expense) => ({
    id: expense.id,
    amountCents: expense.amountCents,
    amountLabel: formatCurrency(expense.amountCents),
    dateISO: toDateInput(expense.date),
    dateLabel: formatDate(expense.date),
    description: expense.description,
    category: {
      id: expense.category.id,
      name: expense.category.name,
      color: expense.category.color,
    },
  }));

  const detail: HarvestDetailData = {
    id: harvest.id,
    name: harvest.name,
    crop: harvest.crop,
    status: harvest.status,
    startDate: harvest.startDate,
    endDate: harvest.endDate,
    notes: harvest.notes,
    totalCents: expenses.reduce((sum, expense) => sum + expense.amountCents, 0),
    expenses,
  };

  return { harvest: detail, categories };
}

export type CategoryBreakdownRow = {
  id: string;
  name: string;
  color: string;
  totalCents: number;
  totalLabel: string;
  percent: number;
  count: number;
};

export function getCategoryBreakdown(
  expenses: ExpenseView[],
  totalCents: number,
): CategoryBreakdownRow[] {
  const rows = new Map<string, CategoryBreakdownRow>();

  for (const expense of expenses) {
    const existing = rows.get(expense.category.id);
    if (existing) {
      existing.totalCents += expense.amountCents;
      existing.count += 1;
    } else {
      rows.set(expense.category.id, {
        id: expense.category.id,
        name: expense.category.name,
        color: expense.category.color,
        totalCents: expense.amountCents,
        totalLabel: "",
        percent: 0,
        count: 1,
      });
    }
  }

  return [...rows.values()]
    .map((row) => ({
      ...row,
      totalLabel: formatCurrency(row.totalCents),
      percent:
        totalCents > 0 ? Math.round((row.totalCents / totalCents) * 100) : 0,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);
}

export type CategoryWithCount = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  expenseCount: number;
};

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { expenses: true } } },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    createdAt: category.createdAt,
    expenseCount: category._count.expenses,
  }));
}
