import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from "../../../src/components/util/LanguageSelector";

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
    t: jest.fn(),
  }),
}));

describe('LanguageSelector', () => {

  test('renders without crashing', () => {
    render(<LanguageSelector />);
  });

  test('initially displays the flag of the current language', () => {
    const { getByAltText } = render(<LanguageSelector />);
    expect(getByAltText('Selected language')).toHaveAttribute('src', '/rm_imgs/uk.png');
  });

  test('changes the flag and language when a different language is selected', () => {
    const { getByAltText, getByTitle } = render(<LanguageSelector />);
    fireEvent.click(getByTitle('Français'));
    expect(getByAltText('Selected language')).toHaveAttribute('src', '/rm_imgs/france.png');
  });

  test('keeps the selected language in local storage', () => {
    const { getByTitle } = render(<LanguageSelector />);
    fireEvent.click(getByTitle('Français'));
    expect(localStorage.getItem('language')).toBe('fr');
  });

});