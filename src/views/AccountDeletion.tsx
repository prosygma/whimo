import React from 'react';
import { Link } from 'react-router';

import logo from '../assets/camertrace-wide.png';

const CONTACT_EMAIL = 'contact@camertrace.cm';

/**
 * Google Play requires a publicly reachable web page describing how to request
 * account and data deletion, usable without reinstalling the app.
 */
const AccountDeletion: React.FC = () => (
  <div className="min-h-screen bg-gray-5 flex flex-col">
    <header className="bg-white border-b border-gray-10">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 flex items-center gap-4">
        <img src={logo} alt="CamerTrace" className="h-11 w-auto object-contain shrink-0" />
      </div>
    </header>

    <main className="flex-1 max-w-3xl w-full mx-auto px-4 lg:px-8 py-10 lg:py-14 flex flex-col gap-8">
      <div>
        <h1 className="text-headline-1 text-surface-dark">
          Suppression de compte et de données
        </h1>
        <p className="text-body-m text-gray-60 mt-2">
          Application CamerTrace — éditée par le CICC (Conseil Interprofessionnel du Cacao et du
          Café), Cameroun.
        </p>
      </div>

      <section className="bg-white border border-gray-10 rounded-xl p-6 flex flex-col gap-3">
        <h2 className="text-headline-2 text-primary">Depuis l'application</h2>
        <p className="text-body-m text-gray-80 leading-relaxed">
          Ouvrez l'application CamerTrace, puis rendez-vous dans{' '}
          <span className="font-medium">Paramètres → Supprimer mon compte</span>. La suppression est
          confirmée dans l'application.
        </p>
      </section>

      <section className="bg-white border border-gray-10 rounded-xl p-6 flex flex-col gap-3">
        <h2 className="text-headline-2 text-primary">Sans réinstaller l'application</h2>
        <p className="text-body-m text-gray-80 leading-relaxed">
          Envoyez une demande à l'adresse ci-dessous depuis l'adresse e-mail associée à votre
          compte, avec pour objet <span className="font-medium">« Suppression de compte »</span>.
          Indiquez votre nom et votre numéro de téléphone afin que nous puissions identifier le
          compte.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Suppression%20de%20compte%20CamerTrace`}
          className="self-start text-body-m font-medium text-white bg-primary hover:bg-primary-hover transition-colors px-5 py-3 rounded-lg"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="text-body-s text-gray-60">
          Votre demande est traitée dans un délai de 30 jours.
        </p>
      </section>

      <section className="bg-white border border-gray-10 rounded-xl p-6 flex flex-col gap-3">
        <h2 className="text-headline-2 text-primary">Données concernées</h2>
        <p className="text-body-m text-gray-80 leading-relaxed">
          La suppression du compte entraîne la suppression des données d'identification de
          l'utilisateur (nom, coordonnées, identifiants de connexion) ainsi que des paramètres
          associés au compte.
        </p>
        <p className="text-body-m text-gray-80 leading-relaxed">
          Certaines données de traçabilité déjà intégrées à une chaîne d'approvisionnement peuvent
          devoir être conservées pour répondre à des obligations légales, réglementaires ou
          contractuelles. Elles sont alors conservées conformément à l'
          <Link to="/terms#article-23" className="text-primary hover:underline">
            article 23 des Termes et Conditions d'Utilisation
          </Link>{' '}
          et ne sont plus rattachées à votre compte.
        </p>
      </section>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-body-s text-gray-60 border-t border-gray-10 pt-6">
        <Link to="/terms" className="hover:text-primary transition-colors">
          Termes et Conditions
        </Link>
        <Link to="/privacy" className="hover:text-primary transition-colors">
          Confidentialité
        </Link>
        <span className="ml-auto">CamerTrace — CICC</span>
      </div>
    </main>
  </div>
);

export default AccountDeletion;
