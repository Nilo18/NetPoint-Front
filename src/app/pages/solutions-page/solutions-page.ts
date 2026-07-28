import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { SolutionsCapabilities } from '../../components/solutions-page-components/solutions-capabilities/solutions-capabilities';
import { SolutionsCta } from '../../components/solutions-page-components/solutions-cta/solutions-cta';
import { SolutionsHero } from '../../components/solutions-page-components/solutions-hero/solutions-hero';
import { SolutionsUseCases } from '../../components/solutions-page-components/solutions-use-cases/solutions-use-cases';
import { SolutionsWorkflow } from '../../components/solutions-page-components/solutions-workflow/solutions-workflow';

@Component({
  selector: 'app-solutions-page',
  imports: [
    Footer,
    Header,
    SolutionsCapabilities,
    SolutionsCta,
    SolutionsHero,
    SolutionsUseCases,
    SolutionsWorkflow,
  ],
  templateUrl: './solutions-page.html',
  styleUrl: './solutions-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionsPage {}
