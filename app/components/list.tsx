import { getProducts } from "@/lib/airtable-client";
import ListItem from "./list-item";

const List = async () => {
  const products = await getProducts();

  return (
    <div className="container">
      <div role="list" className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          .slice()
          .reverse()
          .map((item) => (
            <ListItem key={item.id} item={item} />
          ))}
      </div>
    </div>
  );
};

export default List;
