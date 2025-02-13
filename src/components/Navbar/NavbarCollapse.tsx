import classNames from 'classnames';
import type { ComponentProps, FC, PropsWithChildren } from 'react';
import type { DeepPartial, FlowbiteBoolean } from '~/src';
import { useTheme } from '~/src';
import { mergeDeep } from '~/src/helpers/merge-deep';
import { useNavbarContext } from './NavbarContext';

export interface FlowbiteNavbarCollapseTheme {
  base: string;
  list: string;
  hidden: FlowbiteBoolean;
}

export interface NavbarCollapseProps extends PropsWithChildren<ComponentProps<'div'>> {
  theme?: DeepPartial<FlowbiteNavbarCollapseTheme>;
}

export const NavbarCollapse: FC<NavbarCollapseProps> = ({ children, className, theme: customTheme = {}, ...props }) => {
  const { isOpen } = useNavbarContext();
  const theme = mergeDeep(useTheme().theme.navbar.collapse, customTheme);

  return (
    <div
      data-testid="flowbite-navbar-collapse"
      className={classNames(theme.base, theme.hidden[!isOpen ? 'on' : 'off'], className)}
      {...props}
    >
      <ul className={theme.list}>{children}</ul>
    </div>
  );
};
