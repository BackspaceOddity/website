/**
 * 8Figures assembled from builder blocks (verification slice). Same content
 * (content.ts) + same DS (brand-transformation.css) as the canonical /8figures,
 * but composed from the extracted block components instead of hand-written JSX.
 * If this matches /8figures 1:1, the block extraction is faithful.
 */
import '../../8figures/eightfigures.css';
import { content as c } from '../../8figures/content';
import {
  CalInit, BtNav, BtHero, BtChallenge, BtEps, BtPhasesSection, BtInvest, BtProjects, BtFinal, BtFooter,
} from '../blocks/bt';

export default function Page() {
  return (
    <div className="page bt-page" data-screen-label="8FIGURES — Brand Sprint" lang="en">
      <CalInit />
      <BtNav contact={c.nav.contact} book={c.nav.book} office={c.nav.office} />
      <BtHero eyebrow={c.hero.eyebrow} title={c.hero.title} subtitle={c.hero.subtitle} />
      <BtChallenge h2={c.challenge.h2} you={c.challenge.you} we={c.challenge.we} />
      <BtEps id="approach" label="How we'll approach" h2={c.approach.h2} intro={c.approach.intro} points={c.approach.points} />
      <BtPhasesSection id="phases" label="What we'll do" h2="What we'll do" intro={`${c.sprint.lead} ${c.sprint.note}`} nutshell={c.sprint.nutshell} phases={c.phases} />
      <BtInvest h2={c.investment.eyebrow} price={c.investment.price} terms={c.investment.terms} paymentLabel={c.investment.paymentLabel} payment={c.investment.payment} />
      <BtProjects id="experience" label="What we've done" h2={c.experience.h2} projects={c.experience.projects} />
      <BtFinal h2={c.nextStep.eyebrow} copy={c.nextStep.body} cta={c.nextStep.cta} />
      <BtFooter thisPage={c.footer.thisPage} links={c.footer.links} reach={c.footer.reach} city={c.footer.city} book={c.nav.book} />
    </div>
  );
}
