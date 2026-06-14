import ProductCard from "@/components/ui/productCard";

const Products = ({ products = [] }) => {
  if (!products.length) {
    return (
      <section className="bg-gradient-to-b from-brand-cream to-brand-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center text-brand-gray">
          No products available right now.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-brand-cream to-brand-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="font-semibold uppercase tracking-widest text-brand-amber">
            Products You Might Like
          </span>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Top Picks You&apos;ll Love
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
