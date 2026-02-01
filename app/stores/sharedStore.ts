import { atom } from "nanostores";

type GlobalLoadingState = {
  active: boolean;
  label?: string;
};

export const $legalFooter = atom<GlobalLoadingState>({
  active: false,
  label: undefined,
});

export function hideLegalFooter(label?: string) {
  $legalFooter.set({ active: false, label });
}

export function showLegalFooter() {
  $legalFooter.set({ active: true, label: undefined });
}
