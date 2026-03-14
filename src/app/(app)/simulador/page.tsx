import SimuladorClient from './simulador-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Simulador de Investimentos',
    description: 'Simule o crescimento do seu patrimônio com juros compostos, aportes mensais e diferentes cenários de rentabilidade.',
};

export default function SimuladorPage() {
  return <SimuladorClient />;
}
