import React from 'react';
import LegalPage from '../components/legal/LegalPage.tsx';
import { TCU_SECTIONS, TCU_VERSION } from '../content/tcu.ts';

/** Articles of the TCU that make up the data-protection notice. */
const PRIVACY_ARTICLES = [8, 9, 10, 11, 12, 13, 22, 23, 26, 33];

/**
 * The privacy policy is the data-protection subset of the TCU (collection,
 * purposes, recipients, confidentiality, security, rights, retention), shown on
 * its own URL because Google Play requires a dedicated privacy policy link.
 */
const Privacy: React.FC = () => {
  const sections = TCU_SECTIONS.filter((s) => {
    const n = s.heading.match(/^ARTICLE\s+(\d+)/i);
    return n ? PRIVACY_ARTICLES.includes(Number(n[1])) : false;
  });

  return (
    <LegalPage
      title="Politique de Confidentialité — CamerTrace"
      version={TCU_VERSION}
      intro={
        <div className="bg-primary-subtle border border-primary/20 rounded-xl p-5 flex flex-col gap-3">
          <p className="text-body-m text-gray-80 leading-relaxed">
            CamerTrace est une application de traçabilité des filières cacao et café au Cameroun,
            éditée par le CICC. Cette politique décrit les données que l'application collecte, les
            finalités de leur traitement, leurs destinataires et les droits dont vous disposez.
          </p>
          <div>
            <p className="text-body-m font-semibold text-surface-dark mb-1.5">
              Données collectées par l'application mobile
            </p>
            <ul className="flex flex-col gap-1 pl-5 list-disc marker:text-primary text-body-m text-gray-80">
              <li>
                <span className="font-medium">Position géographique (précise et approximative)</span>{' '}
                — pour enregistrer les coordonnées des parcelles et des opérations. Il s'agit de la
                fonction principale de l'application. Aucune collecte en arrière-plan n'est
                effectuée.
              </li>
              <li>
                <span className="font-medium">Appareil photo</span> — pour la lecture des codes
                (QR / codes-barres) et la capture de justificatifs.
              </li>
              <li>
                <span className="font-medium">Contacts</span> — pour faciliter l'identification et
                l'ajout d'acteurs de la chaîne d'approvisionnement déjà connus de l'utilisateur.
              </li>
              <li>
                <span className="font-medium">Notifications</span> — pour informer l'utilisateur des
                opérations le concernant.
              </li>
              <li>
                <span className="font-medium">Données de diagnostic</span> — rapports de plantage et
                statistiques d'usage (Firebase Crashlytics et Analytics), afin d'assurer la
                stabilité du service.
              </li>
            </ul>
          </div>
          <p className="text-body-s text-gray-70">
            Les articles ci-dessous sont extraits des Termes et Conditions d'Utilisation de
            CamerTrace, qui constituent le document de référence.
          </p>
        </div>
      }
      sections={sections}
    />
  );
};

export default Privacy;
