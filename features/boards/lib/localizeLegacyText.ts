const LEGACY_PT_TO_EN: Record<string, string> = {
  '1. Captação / Leads': '1. Lead Capture',
  '2. Vendas (Oferta / Turma)': '2. Sales (Offer / Cohort)',
  '3. Onboarding do Aluno (Ativação)': '3. Student Onboarding (Activation)',
  '4. CS (Saúde do Aluno)': '4. CS (Student Health)',
  '5. Upsell (Expansão)': '5. Upsell (Expansion)',
  'Novos Leads': 'New Leads',
  'Contatado': 'Contacted',
  'Qualificando': 'Qualifying',
  'Qualificado (MQL)': 'Qualified (MQL)',
  'Descoberta': 'Discovery',
  'Proposta': 'Proposal',
  'Negociação': 'Negotiation',
  'Matriculado (Ganho)': 'Enrolled (Won)',
  'Não comprou (Perdido)': "Didn't buy (Lost)",
  'Captação e Qualificação': 'Capture and Qualification',
  'Leads vindos de ads, orgânico, direct, WhatsApp ou página de captura.':
    'Leads from ads, organic, direct, WhatsApp, or landing page.',
  'Moveu para': 'Moved to',
  'Contato promovido para Cliente': 'Contact promoted to Customer',
  'Primeira Entrega': 'First Delivery',
  'Setup (Acessos)': 'Setup (Access)',
  'Automático via LinkedStage da etapa': 'Automatic via LinkedStage of stage',
};

export function localizeLegacyBoardText(text: string | null | undefined, locale: string): string {
  if (!text) return text ?? '';
  if (!locale.toLowerCase().startsWith('en')) return text;
  const exact = LEGACY_PT_TO_EN[text];
  if (exact) return exact;

  let out = text;

  // Phrase-level normalization for legacy timeline/activity strings.
  out = out.replace(/^Moveu para\s+/i, 'Moved to ');
  out = out.replace(/^Contato promovido para Cliente$/i, 'Contact promoted to Customer');
  out = out.replace(/^Automático via LinkedStage da etapa/i, 'Automatic via LinkedStage of stage');

  // Token-level replacement for mixed legacy strings.
  const tokenPairs = Object.entries(LEGACY_PT_TO_EN).sort((a, b) => b[0].length - a[0].length);
  for (const [pt, en] of tokenPairs) {
    out = out.replace(new RegExp(pt.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&'), 'g'), en);
  }

  return out;
}
