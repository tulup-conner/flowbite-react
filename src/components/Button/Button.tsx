import classNames from 'classnames';
import { forwardRef, type ComponentProps, type ReactNode } from 'react';
import type {
  DeepPartial,
  FlowbiteBoolean,
  FlowbiteColors,
  FlowbiteGradientColors,
  FlowbiteGradientDuoToneColors,
  FlowbiteSizes,
} from '~/src';
import { Spinner, useTheme } from '~/src';
import { mergeDeep } from '~/src/helpers/merge-deep';
import type { PositionInButtonGroup } from './ButtonGroup';
import ButtonGroup from './ButtonGroup';

export interface FlowbiteButtonTheme {
  base: string;
  fullSized: string;
  color: FlowbiteColors;
  disabled: string;
  isProcessing: string;
  spinnerSlot: string;
  gradient: ButtonGradientColors;
  gradientDuoTone: ButtonGradientDuoToneColors;
  inner: FlowbiteButtonInnerTheme;
  label: string;
  outline: FlowbiteButtonOutlineTheme;
  pill: FlowbiteBoolean;
  size: ButtonSizes;
}

export interface FlowbiteButtonInnerTheme {
  base: string;
  position: PositionInButtonGroup;
  outline: string;
}

export interface FlowbiteButtonOutlineTheme extends FlowbiteBoolean {
  color: ButtonOutlineColors;
  pill: FlowbiteBoolean;
}

export interface ButtonColors
  extends Pick<FlowbiteColors, 'dark' | 'failure' | 'gray' | 'info' | 'light' | 'purple' | 'success' | 'warning'> {
  [key: string]: string;
}

export interface ButtonGradientColors extends FlowbiteGradientColors {
  [key: string]: string;
}

export interface ButtonGradientDuoToneColors extends FlowbiteGradientDuoToneColors {
  [key: string]: string;
}

export interface ButtonOutlineColors extends Pick<FlowbiteColors, 'gray'> {
  [key: string]: string;
}

export interface ButtonSizes extends Pick<FlowbiteSizes, 'xs' | 'sm' | 'lg' | 'xl'> {
  [key: string]: string;
}

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'color' | 'ref'> {
  color?: keyof FlowbiteColors;
  fullSized?: boolean;
  gradientDuoTone?: keyof ButtonGradientDuoToneColors;
  gradientMonochrome?: keyof ButtonGradientColors;
  href?: string;
  target?: string;
  isProcessing?: boolean;
  processingLabel?: string;
  processingSpinner?: ReactNode;
  label?: ReactNode;
  outline?: boolean;
  pill?: boolean;
  positionInGroup?: keyof PositionInButtonGroup;
  size?: keyof ButtonSizes;
  theme?: DeepPartial<FlowbiteButtonTheme>;
}

const ButtonComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      className,
      color = 'info',
      disabled = false,
      fullSized,
      isProcessing = false,
      processingLabel = 'Loading...',
      processingSpinner: SpinnerComponent = <Spinner />,
      gradientDuoTone,
      gradientMonochrome,
      href,
      label,
      outline = false,
      pill = false,
      positionInGroup = 'none',
      size = 'md',
      theme: customTheme = {},
      ...props
    },
    ref,
  ) => {
    const { buttonGroup: groupTheme, button: buttonTheme } = useTheme().theme;
    const theme = mergeDeep(buttonTheme, customTheme);

    const isLink = typeof href !== 'undefined';
    const Component = isLink ? 'a' : 'button';
    const theirProps = props as object;

    return (
      <Component
        disabled={disabled}
        href={href}
        type={isLink ? undefined : 'button'}
        ref={ref as never}
        className={classNames(
          disabled && theme.disabled,
          !gradientDuoTone && !gradientMonochrome && theme.color[color],
          gradientDuoTone && !gradientMonochrome && theme.gradientDuoTone[gradientDuoTone],
          !gradientDuoTone && gradientMonochrome && theme.gradient[gradientMonochrome],
          groupTheme.position[positionInGroup],
          outline && (theme.outline.color[color] ?? theme.outline.color.default),
          theme.base,
          theme.pill[pill ? 'on' : 'off'],
          fullSized && theme.fullSized,
          className,
        )}
        {...theirProps}
      >
        <span
          className={classNames(
            theme.inner.base,
            theme.inner.position[positionInGroup],
            theme.outline[outline ? 'on' : 'off'],
            theme.outline.pill[outline && pill ? 'on' : 'off'],
            theme.size[size],
            outline && !theme.outline.color[color] && theme.inner.outline,
            isProcessing && theme.isProcessing,
          )}
        >
          <>
            {isProcessing && <span className={theme.spinnerSlot}>{SpinnerComponent}</span>}
            {typeof children !== 'undefined' ? (
              children
            ) : (
              <span data-testid="flowbite-button-label" className={theme.label}>
                {isProcessing ? processingLabel : label}
              </span>
            )}
          </>
        </span>
      </Component>
    );
  },
);

ButtonComponent.displayName = 'Button';
export const Button = Object.assign(ButtonComponent, {
  Group: ButtonGroup,
});
