import React from 'react';
import { NavLink } from 'react-router';

type navigationRoute = `/${string}`;

interface Props {
  label: string;
  route: navigationRoute;
  Icon: React.ElementType;
  showActiveState?: boolean;
}

const MenuItem: React.FC<Props> = ({ label, route, Icon, showActiveState = true }) => {
  return (
    <NavLink to={route} className={`px-8 py-3 flex items-center gap-3 text-button-m text-nav-inactive hover:text-nav-active hover:[&>p]:text-white hover:shadow-[4px_0_0_0_var(--color-accent)_inset] ${showActiveState && '[&.active]:text-nav-active [&.active]:shadow-[4px_0_0_0_var(--color-accent)_inset] [&.active>p]:text-white [&.active]:bg-linear-to-r [&.active]:from-accent/30 [&.active]:to-transparent'}`}>
      <Icon className="size-7" />
      <p>{label}</p>
    </NavLink>
  );
};

export default MenuItem;
