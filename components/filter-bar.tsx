const categories = ["general", "business", "technology", "science", "sports", "entertainment", "health"];
const countries = [
  { code: "in", label: "India" },
  { code: "us", label: "United States" },
  { code: "gb", label: "United Kingdom" },
  { code: "au", label: "Australia" }
];

export function FilterBar(props: {
  category: string;
  country: string;
  onCategoryChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}) {
  return (
    <section className="mb-8 grid gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-4 md:grid-cols-[1fr_1fr_auto]">
      <select
        value={props.category}
        onChange={(e) => props.onCategoryChange(e.target.value)}
        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
      >
        {categories.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={props.country}
        onChange={(e) => props.onCountryChange(e.target.value)}
        className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100"
      >
        {countries.map((item) => (
          <option key={item.code} value={item.code}>{item.label}</option>
        ))}
      </select>

      <button
        onClick={props.onRefresh}
        disabled={props.loading}
        className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {props.loading ? "Refreshing..." : "Refresh news"}
      </button>
    </section>
  );
}
