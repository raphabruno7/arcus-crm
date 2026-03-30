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
};

export function localizeLegacyBoardText(text: string | null | undefined, locale: string): string {
  if (!text) return text ?? '';
  if (!locale.toLowerCase().startsWith('en')) return text;
  return LEGACY_PT_TO_EN[text] ?? text;
}
