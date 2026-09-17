import React, { useMemo } from 'react';
import { Link } from 'react-router';
import type { LegalSection } from '../../content/tcu.ts';
import { sectionId } from '../../helpers/sectionId.ts';

import logo from '../../assets/camertrace-wide.png';

type Props = {
  title: string;
  version?: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
};

const LegalPage: React.FC<Props> = ({ title, version, intro, sections }) => {
  const toc = useMemo(
    () => sections.map((s) => ({ id: sectionId(s.heading), heading: s.heading })),
    [sections],
  );

  return (
    <div className="min-h-screen bg-gray-5">
      <header className="bg-white border-b border-gray-10">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 flex items-center gap-4">
          <img src={logo} alt="CamerTrace" className="h-11 w-auto object-contain shrink-0" />
          <Link
            to="/login"
            className="ml-auto text-body-s px-4 py-2 rounded-lg text-primary hover:bg-primary-subtle border border-gray-10 transition-colors whitespace-nowrap"
          >
            Connexion
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <h1 className="text-headline-1 text-surface-dark">{title}</h1>
        {version && <p className="text-body-s text-gray-60 mt-2">{version}</p>}
        {intro && <div className="mt-6">{intro}</div>}

        <div className="mt-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10 lg:items-start">
          <nav className="hidden lg:block sticky top-8 max-h-[80vh] overflow-y-auto pr-2">
            <p className="text-body-xs uppercase tracking-wide text-gray-50 mb-3">Sommaire</p>
            <ul className="flex flex-col gap-1.5">
              {toc.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-body-xs text-gray-60 hover:text-primary transition-colors block leading-snug"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 flex flex-col gap-8">
            {sections.map((s) => (
              <section key={sectionId(s.heading)} id={sectionId(s.heading)} className="scroll-mt-8">
                <h2 className="text-headline-2 text-primary mb-3">{s.heading}</h2>
                <div className="flex flex-col gap-3">
                  {s.blocks.map((b, i) =>
                    b.type === 'p' ? (
                      <p key={i} className="text-body-m text-gray-80 leading-relaxed">
                        {b.text}
                      </p>
                    ) : (
                      <ul key={i} className="flex flex-col gap-1.5 pl-5 list-disc marker:text-primary">
                        {b.items.map((it, j) => (
                          <li key={j} className="text-body-m text-gray-80 leading-relaxed">
                            {it}
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>

      <footer className="border-t border-gray-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 flex flex-wrap gap-x-6 gap-y-2 text-body-s text-gray-60">
          <Link to="/terms" className="hover:text-primary transition-colors">
            Termes et Conditions
          </Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Confidentialité
          </Link>
          <Link to="/account-deletion" className="hover:text-primary transition-colors">
            Suppression de compte
          </Link>
          <span className="ml-auto">CamerTrace — CICC</span>
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;
