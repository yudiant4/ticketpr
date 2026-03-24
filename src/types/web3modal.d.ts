import { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'w3m-button': DetailedHTMLProps<HTMLAttributes<HTMLElement> & {
                balance?: 'show' | 'hide';
                size?: 'md' | 'sm';
                label?: string;
                loadingLabel?: string;
            }, HTMLElement>;
            'w3m-network-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
            'w3m-account-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
            'w3m-connect-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}