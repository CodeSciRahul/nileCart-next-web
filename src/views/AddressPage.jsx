export default function AddressPage({ addresses = [], cart }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Address</h1>
      <p className="mt-2 text-brand-gray">{addresses.length} saved addresses</p>
      <p className="text-brand-gray">Cart items: {cart?.itemCount ?? 0}</p>
    </div>
  );
}
