
import Link from "next/link";

const categories = [
  {
    name: "Dresses",
    image:
      "https://img105.savana.com/v1/51fd5601c16b49e99a1ed4d35bf76f33_w360.webp",
  },
  {
    name: "Tops",
    image:
      "https://img105.savana.com/v1/2e2992df39904be6be0b37fa12f49855_w360.webp",
  },
  {
    name: "Bottoms",
    image:
      "https://img105.savana.com/v1/d8eece4486724969bded3da88b84098a_w360.webp",
  },
  {
    name: "Accessories",
    image:
      "https://img105.savana.com/v1/4e09cf5cf45d4493814ef48ca2d71bbc_w360.webp",
  },
  {
    name: "Jewellery",
    image:
      "https://img105.savana.com/v1/60c7d9a9d613402f881b04649143869d_w360.webp",
  },
  {
    name: "Beauty",
    image:
      "https://img105.savana.com/v1/de890efbd67d4122b4ce9046f9a641b3_w360.webp",
  },
  {
    name: "Bags",
    image:
      "https://img105.savana.com/v1/c4d729bdfaa14786986463f4880b655a_w360.webp",
  },
  {
    name: "Swimwear",
    image:
      "https://img105.savana.com/v1/0c5516debdd547d3a946cc6087a75e89_w360.webp",
  },
  {
    name: "Sports",
    image:
      "https://img105.savana.com/v1/e02d1551119b44de9eff5d5e6dc7cdef_w360.webp",
  },
  {
    name: "Bags",
    image:
      "https://img105.savana.com/v1/839144f4c6cd4e3db2cf1b5e112fb4a1_w360.webp",
  },
];

const CategoriesSection = ({ categories }) => {
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
      </div>
    </section>
  );
};

export default CategoriesSection;
