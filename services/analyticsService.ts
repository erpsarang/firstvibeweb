
interface EventParams {
  [key: string]: string | number | boolean;
}

const trackEvent = (eventName: string, params?: EventParams): void => {
  console.log(`[Analytics Event]: ${eventName}`, params || '');
};

export const analyticsService = {
  viewHero: () => {
    trackEvent('view_hero');
  },
  clickCta: (ctaId: string) => {
    trackEvent('click_cta', { cta_id: ctaId });
  },
  viewCards: (cardCount: number) => {
    trackEvent('view_cards', { cards_count: cardCount });
  },
  submitLead: () => {
    trackEvent('submit_lead');
  },
  leadSuccess: () => {
    trackEvent('lead_success');
  },
  leadError: (errorCode: string) => {
    trackEvent('lead_error', { error_code: errorCode });
  },
};
