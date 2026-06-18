import Header from "@/components/header";
import AccountShell from "@/components/account/AccountShell";

export const metadata = {
  title: "My Account — NileCart",
};

export default function AccountLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <AccountShell>{children}</AccountShell>
    </div>
  );
}
