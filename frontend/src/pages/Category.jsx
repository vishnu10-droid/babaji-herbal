import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import CategoryShowcase from "../components/CategoryShowcase";

export default function Category() {
  const [query, setQuery] = useState("");
  const { data: categories } = useSelector((state) => state.category);
  const matchingCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.isActive &&
          `${category.name} ${category.description}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [categories, query],
  );

  return (
    <>
      <section className="section-shell pt-12">
        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
              size={18}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-full border border-emerald-100 bg-white py-3 pl-11 pr-4 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </section>
      <CategoryShowcase categoryList={query ? matchingCategories : undefined} />
    </>
  );
}
