
import { CategoriesSection } from "../sections/categories-section";
import { ResultsSection } from "../sections/results-section";


interface SearchViewProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const SearchView = ({ query, categoryId }: SearchViewProps) => {
  
  return (
    <div className="max-w-325 mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection query={query} categoryId={categoryId} />
    </div>
  );
};
