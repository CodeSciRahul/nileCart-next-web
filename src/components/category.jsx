import Link from "next/link";

const CategoriesSection = ({ categories = [] }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-brand-cream to-brand-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-brand-amber font-semibold uppercase tracking-widest">
            Shop By Category
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-black text-foreground">
            Find Your Style
          </h2>

          <p className="mt-4 text-brand-gray">
            Curated collections designed for every mood and occasion.
          </p>
        </div>

        {/* Categories */}
        {categories.length === 0 ? (
          <p className="text-center text-sm text-brand-gray">
            Subcategories will appear here once added under Men or Women in the
            admin panel.
          </p>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories?.map((category, index) => {
            const CardWrapper = category.slug ? Link : "div";
            const cardProps = category.slug
              ? { href: `/shop/${category.slug}` }
              : {};

            return (
              <CardWrapper
                key={category._id || `${category.name}-${index}`}
                {...cardProps}
                className="group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
              <div className="relative overflow-hidden rounded-[30px] shadow-lg bg-brand-white">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={category?.image}
                    alt={category.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-all
                      duration-700
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Overlay */}
                <div
                  className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/60
                  via-transparent
                  to-transparent
                "
                />

                {/* Category Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div
                    className="
                    bg-brand-white/90
                    backdrop-blur-md
                    rounded-full
                    px-4
                    py-2
                    text-center
                    shadow-lg
                  "
                  >
                    <h3 className="font-bold text-foreground">{category.name}</h3>
                  </div>
                </div>

                {/* Hover Border */}
                <div
                  className="
                  absolute
                  inset-0
                  border-2
                  border-transparent
                  group-hover:border-brand-amber
                  rounded-[30px]
                  transition-all
                  duration-500
                "
                />
              </div>
            </CardWrapper>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
