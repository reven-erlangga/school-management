import { Style } from '../enums/style.enum';

export const STYLE_CLASS: Record<Style, string> = {
  [Style.SUCCESS]: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  [Style.ERROR]: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  [Style.WARNING]: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  [Style.INFO]: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
};

export const ICON_BG_CLASS: Record<Style, string> = {
  [Style.SUCCESS]: 'bg-emerald-500/20 text-emerald-300',
  [Style.ERROR]: 'bg-rose-500/20 text-rose-300',
  [Style.WARNING]: 'bg-amber-500/20 text-amber-300',
  [Style.INFO]: 'bg-indigo-500/20 text-indigo-300',
};

export const ICON_BY_STYLE: Record<Style, string> = {
  [Style.SUCCESS]: 'check',
  [Style.ERROR]: 'close',
  [Style.WARNING]: 'info',
  [Style.INFO]: 'info',
};
