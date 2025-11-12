import PageLayout from '../components/PageLayout';

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout activeNav="transactions">{children}</PageLayout>;
}
